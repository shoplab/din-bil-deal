<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    /**
     * Display customer's conversations
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $filter = $request->get('filter', 'all');
        
        $query = $user->conversations()->with(['car', 'assignedAgent', 'messages' => function($query) {
            $query->latest()->limit(1);
        }]);
        
        // Apply filters
        switch ($filter) {
            case 'unread':
                $query->unreadByCustomer();
                break;
            case 'open':
                $query->where('status', '!=', Conversation::STATUS_CLOSED);
                break;
            case 'closed':
                $query->closed();
                break;
            default:
                // Show all conversations
                break;
        }
        
        $conversations = $query->recentActivity()
            ->paginate(15)
            ->through(function ($conversation) use ($user) {
                $lastMessage = $conversation->messages->first();
                
                return [
                    'id' => $conversation->id,
                    'subject' => $conversation->subject,
                    'status' => $conversation->status,
                    'status_label' => $conversation->getStatusLabel(),
                    'status_color' => $conversation->getStatusColor(),
                    'priority' => $conversation->priority,
                    'priority_label' => $conversation->getPriorityLabel(),
                    'priority_color' => $conversation->getPriorityColor(),
                    'type' => $conversation->type,
                    'type_label' => $conversation->getTypeLabel(),
                    'last_message_at' => $conversation->last_message_at,
                    'unread_count' => $conversation->getUnreadCount($user),
                    'car' => $conversation->car ? [
                        'id' => $conversation->car->id,
                        'make' => $conversation->car->make,
                        'model' => $conversation->car->model,
                        'year' => $conversation->car->year,
                    ] : null,
                    'assigned_agent' => $conversation->assignedAgent ? [
                        'name' => $conversation->assignedAgent->name,
                        'email' => $conversation->assignedAgent->email,
                    ] : null,
                    'last_message' => $lastMessage ? [
                        'message' => \Illuminate\Support\Str::limit($lastMessage->message, 100),
                        'is_from_customer' => $lastMessage->isFromCustomer(),
                        'created_at' => $lastMessage->created_at,
                    ] : null,
                ];
            });
        
        // Get conversation stats
        $stats = [
            'total' => $user->conversations()->count(),
            'unread' => $user->conversations()->unreadByCustomer()->count(),
            'open' => $user->conversations()->where('status', '!=', Conversation::STATUS_CLOSED)->count(),
            'closed' => $user->conversations()->closed()->count(),
        ];
        
        return Inertia::render('Customer/Messages/Index', [
            'conversations' => $conversations,
            'stats' => $stats,
            'filter' => $filter,
        ]);
    }
    
    /**
     * Show conversation details and messages
     */
    public function show(Conversation $conversation): Response
    {
        // Ensure customer can only view their own conversations
        if ($conversation->customer_id !== Auth::id()) {
            abort(403);
        }
        
        // Mark conversation as read by customer
        $conversation->markAsRead(Auth::user());
        
        $conversation->load(['car', 'assignedAgent', 'messages.sender']);
        
        $conversationData = [
            'id' => $conversation->id,
            'subject' => $conversation->subject,
            'status' => $conversation->status,
            'status_label' => $conversation->getStatusLabel(),
            'status_color' => $conversation->getStatusColor(),
            'priority' => $conversation->priority,
            'priority_label' => $conversation->getPriorityLabel(),
            'priority_color' => $conversation->getPriorityColor(),
            'type' => $conversation->type,
            'type_label' => $conversation->getTypeLabel(),
            'created_at' => $conversation->created_at,
            'last_message_at' => $conversation->last_message_at,
            'car' => $conversation->car ? [
                'id' => $conversation->car->id,
                'make' => $conversation->car->make,
                'model' => $conversation->car->model,
                'variant' => $conversation->car->variant,
                'year' => $conversation->car->year,
                'price' => $conversation->car->price,
            ] : null,
            'assigned_agent' => $conversation->assignedAgent ? [
                'id' => $conversation->assignedAgent->id,
                'name' => $conversation->assignedAgent->name,
                'email' => $conversation->assignedAgent->email,
                'phone' => $conversation->assignedAgent->phone,
            ] : null,
        ];
        
        $messages = $conversation->messages()->public()
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'message' => $message->message,
                    'created_at' => $message->created_at,
                    'is_from_customer' => $message->isFromCustomer(),
                    'sender' => [
                        'id' => $message->sender->id,
                        'name' => $message->sender->name,
                        'role' => $message->sender->role,
                    ],
                    'attachments' => $message->attachments ?? [],
                ];
            });
        
        return Inertia::render('Customer/Messages/Show', [
            'conversation' => $conversationData,
            'messages' => $messages,
        ]);
    }
    
    /**
     * Create a new conversation
     */
    public function create(Request $request): Response
    {
        $carId = $request->get('car_id');
        $car = null;
        
        if ($carId) {
            $car = Car::findOrFail($carId);
        }
        
        // Get conversation types
        $conversationTypes = [
            ['value' => Conversation::TYPE_GENERAL_INQUIRY, 'label' => 'Allmän förfrågan'],
            ['value' => Conversation::TYPE_CAR_INQUIRY, 'label' => 'Bil förfrågan'],
            ['value' => Conversation::TYPE_FINANCING, 'label' => 'Finansiering'],
            ['value' => Conversation::TYPE_SERVICE, 'label' => 'Service'],
            ['value' => Conversation::TYPE_COMPLAINT, 'label' => 'Klagomål'],
        ];
        
        return Inertia::render('Customer/Messages/Create', [
            'car' => $car ? [
                'id' => $car->id,
                'make' => $car->make,
                'model' => $car->model,
                'variant' => $car->variant,
                'year' => $car->year,
                'price' => $car->price,
            ] : null,
            'conversationTypes' => $conversationTypes,
        ]);
    }
    
    /**
     * Store a new conversation
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'type' => 'required|in:' . implode(',', Conversation::getAllTypes()),
            'message' => 'required|string|max:2000',
            'car_id' => 'nullable|exists:cars,id',
            'priority' => 'nullable|in:' . implode(',', Conversation::getAllPriorities()),
        ]);
        
        DB::transaction(function () use ($user, $validated) {
            // Create conversation
            $conversation = Conversation::create([
                'subject' => $validated['subject'],
                'customer_id' => $user->id,
                'car_id' => $validated['car_id'] ?? null,
                'type' => $validated['type'],
                'priority' => $validated['priority'] ?? Conversation::PRIORITY_MEDIUM,
                'status' => Conversation::STATUS_OPEN,
            ]);
            
            // Create initial message
            Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $user->id,
                'message' => $validated['message'],
                'is_internal_note' => false,
            ]);
        });
        
        return redirect()->route('customer.messages.index')
                        ->with('success', 'Ditt meddelande har skickats! Vi återkommer inom kort.');
    }
    
    /**
     * Send a reply to an existing conversation
     */
    public function reply(Request $request, Conversation $conversation)
    {
        // Ensure customer can only reply to their own conversations
        if ($conversation->customer_id !== Auth::id()) {
            abort(403);
        }
        
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
        ]);
        
        // Create reply message
        Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => Auth::id(),
            'message' => $validated['message'],
            'is_internal_note' => false,
        ]);
        
        // Update conversation status if it was closed
        if ($conversation->status === Conversation::STATUS_CLOSED) {
            $conversation->changeStatus(Conversation::STATUS_OPEN);
        }
        
        return back()->with('success', 'Ditt svar har skickats!');
    }
    
    /**
     * Create a new conversation from car inquiry
     */
    public function createFromCar(Car $car): Response
    {
        return redirect()->route('customer.messages.create', ['car_id' => $car->id]);
    }
}
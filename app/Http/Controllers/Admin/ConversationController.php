<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $query = Conversation::with(['customer', 'assignedAgent', 'car', 'messages' => function ($query) {
            $query->latest()->limit(1);
        }]);

        // Apply filters
        if ($request->filled('search')) {
            $query->whereHas('customer', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority') && $request->priority !== 'all') {
            $query->byPriority($request->priority);
        }

        if ($request->filled('agent') && $request->agent !== 'all') {
            if ($request->agent === 'unassigned') {
                $query->whereNull('assigned_agent_id');
            } else {
                $query->where('assigned_agent_id', $request->agent);
            }
        }

        if ($request->filled('unread_only') && $request->unread_only === 'yes') {
            $query->unreadByAgent();
        }

        // Sorting
        $sortBy = $request->get('sort', 'last_message_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $conversations = $query->paginate(15)->through(function ($conversation) {
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
                'has_unread_agent_messages' => $conversation->has_unread_agent_messages,
                'has_unread_customer_messages' => $conversation->has_unread_customer_messages,
                'last_message_at' => $conversation->last_message_at,
                'created_at' => $conversation->created_at,
                'customer' => $conversation->customer ? [
                    'id' => $conversation->customer->id,
                    'name' => $conversation->customer->name,
                    'email' => $conversation->customer->email,
                ] : null,
                'car' => $conversation->car ? [
                    'id' => $conversation->car->id,
                    'make' => $conversation->car->make,
                    'model' => $conversation->car->model,
                    'year' => $conversation->car->year,
                ] : null,
                'assigned_agent' => $conversation->assignedAgent ? [
                    'id' => $conversation->assignedAgent->id,
                    'name' => $conversation->assignedAgent->name,
                ] : null,
                'last_message' => $lastMessage ? [
                    'message' => substr($lastMessage->message, 0, 100) . (strlen($lastMessage->message) > 100 ? '...' : ''),
                    'sender_name' => $lastMessage->sender->name ?? 'Okänd',
                    'is_from_customer' => $lastMessage->isFromCustomer(),
                    'created_at' => $lastMessage->created_at,
                ] : null,
                'messages_count' => $conversation->messages()->count(),
                'unread_messages_count' => $conversation->getUnreadCount(auth()->user()),
            ];
        });

        // Get filter options
        $agents = User::admins()->select('id', 'name')->get();
        $statuses = Conversation::getAllStatuses();

        return Inertia::render('Admin/Conversations/Index', [
            'conversations' => $conversations,
            'filters' => $request->only(['search', 'status', 'priority', 'agent', 'unread_only', 'sort', 'order']),
            'agents' => $agents,
            'statuses' => $statuses,
        ]);
    }

    public function create()
    {
        $customers = User::customers()->select('id', 'name', 'email')->get();
        $cars = Car::published()
                   ->available()
                   ->select('id', 'make', 'model', 'year', 'price')
                   ->orderBy('make')
                   ->orderBy('model')
                   ->get();
        $agents = User::admins()->select('id', 'name')->get();

        return Inertia::render('Admin/Conversations/Create', [
            'customers' => $customers,
            'cars' => $cars,
            'agents' => $agents,
            'statuses' => Conversation::getAllStatuses(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:users,id',
            'car_id' => 'nullable|exists:cars,id',
            'assigned_agent_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'status' => 'required|in:' . implode(',', Conversation::getAllStatuses()),
            'priority' => 'required|integer|in:1,2,3',
            'initial_message' => 'required|string',
        ]);

        $conversation = Conversation::create([
            'customer_id' => $validated['customer_id'],
            'car_id' => $validated['car_id'],
            'assigned_agent_id' => $validated['assigned_agent_id'],
            'subject' => $validated['subject'],
            'status' => $validated['status'],
            'priority' => $validated['priority'],
        ]);

        // Create initial message
        $conversation->messages()->create([
            'sender_id' => auth()->id(),
            'message' => $validated['initial_message'],
            'is_internal_note' => false,
        ]);

        return redirect()->route('admin.conversations.show', $conversation)
                        ->with('success', 'Konversation skapad framgångsrikt!');
    }

    public function show(Conversation $conversation)
    {
        $conversation->load(['customer', 'car', 'assignedAgent']);
        
        // Mark messages as read by agent
        $conversation->markAsRead(auth()->user());

        // Get messages with sender info
        $messages = $conversation->messages()
                                ->with('sender')
                                ->orderBy('created_at', 'asc')
                                ->get()
                                ->map(function ($message) {
                                    return [
                                        'id' => $message->id,
                                        'message' => $message->message,
                                        'formatted_message' => $message->getFormattedMessage(),
                                        'attachments' => $message->attachments ?? [],
                                        'is_internal_note' => $message->is_internal_note,
                                        'is_from_customer' => $message->isFromCustomer(),
                                        'is_from_agent' => $message->isFromAgent(),
                                        'read_at' => $message->read_at,
                                        'created_at' => $message->created_at,
                                        'sender' => $message->sender ? [
                                            'id' => $message->sender->id,
                                            'name' => $message->sender->name,
                                            'role' => $message->sender->role,
                                        ] : null,
                                    ];
                                });

        return Inertia::render('Admin/Conversations/Show', [
            'conversation' => [
                'id' => $conversation->id,
                'subject' => $conversation->subject,
                'status' => $conversation->status,
                'status_label' => $conversation->getStatusLabel(),
                'status_color' => $conversation->getStatusColor(),
                'priority' => $conversation->priority,
                'priority_label' => $conversation->getPriorityLabel(),
                'priority_color' => $conversation->getPriorityColor(),
                'has_unread_agent_messages' => $conversation->has_unread_agent_messages,
                'has_unread_customer_messages' => $conversation->has_unread_customer_messages,
                'last_message_at' => $conversation->last_message_at,
                'created_at' => $conversation->created_at,
                'updated_at' => $conversation->updated_at,
                'customer' => $conversation->customer ? [
                    'id' => $conversation->customer->id,
                    'name' => $conversation->customer->name,
                    'email' => $conversation->customer->email,
                    'phone' => $conversation->customer->phone,
                ] : null,
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
                ] : null,
            ],
            'messages' => $messages,
            'agents' => User::admins()->select('id', 'name')->get(),
            'statuses' => Conversation::getAllStatuses(),
        ]);
    }

    public function edit(Conversation $conversation)
    {
        $customers = User::customers()->select('id', 'name', 'email')->get();
        $cars = Car::published()
                   ->available()
                   ->select('id', 'make', 'model', 'year', 'price')
                   ->orderBy('make')
                   ->orderBy('model')
                   ->get();
        $agents = User::admins()->select('id', 'name')->get();

        return Inertia::render('Admin/Conversations/Edit', [
            'conversation' => [
                'id' => $conversation->id,
                'customer_id' => $conversation->customer_id,
                'car_id' => $conversation->car_id,
                'assigned_agent_id' => $conversation->assigned_agent_id,
                'subject' => $conversation->subject,
                'status' => $conversation->status,
                'priority' => $conversation->priority,
            ],
            'customers' => $customers,
            'cars' => $cars,
            'agents' => $agents,
            'statuses' => Conversation::getAllStatuses(),
        ]);
    }

    public function update(Request $request, Conversation $conversation)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:users,id',
            'car_id' => 'nullable|exists:cars,id',
            'assigned_agent_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'status' => 'required|in:' . implode(',', Conversation::getAllStatuses()),
            'priority' => 'required|integer|in:1,2,3',
        ]);

        $conversation->update($validated);

        return redirect()->route('admin.conversations.show', $conversation)
                        ->with('success', 'Konversation uppdaterad framgångsrikt!');
    }

    public function destroy(Conversation $conversation)
    {
        $conversation->delete();

        return redirect()->route('admin.conversations.index')
                        ->with('success', 'Konversation borttagen framgångsrikt!');
    }

    public function reply(Request $request, Conversation $conversation)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'is_internal_note' => 'boolean',
        ]);

        $conversation->messages()->create([
            'sender_id' => auth()->id(),
            'message' => $validated['message'],
            'is_internal_note' => $validated['is_internal_note'] ?? false,
        ]);

        // Update conversation status if it was closed
        if ($conversation->status === 'closed' && !($validated['is_internal_note'] ?? false)) {
            $conversation->update(['status' => 'open']);
        }

        return back()->with('success', $validated['is_internal_note'] ?? false ? 'Intern anteckning tillagd!' : 'Svar skickat!');
    }

    public function updateStatus(Request $request, Conversation $conversation)
    {
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', Conversation::getAllStatuses()),
        ]);

        $conversation->update($validated);

        return back()->with('success', 'Konversationsstatus uppdaterad!');
    }

    public function updatePriority(Request $request, Conversation $conversation)
    {
        $validated = $request->validate([
            'priority' => 'required|integer|in:1,2,3',
        ]);

        $conversation->update($validated);

        return back()->with('success', 'Konversationsprioritet uppdaterad!');
    }

    public function assign(Request $request, Conversation $conversation)
    {
        $validated = $request->validate([
            'assigned_agent_id' => 'required|exists:users,id',
        ]);

        $conversation->update($validated);

        return back()->with('success', 'Konversation tilldelad!');
    }

    public function close(Conversation $conversation)
    {
        $conversation->update(['status' => 'closed']);

        return back()->with('success', 'Konversation stängd!');
    }

    public function reopen(Conversation $conversation)
    {
        $conversation->update(['status' => 'open']);

        return back()->with('success', 'Konversation återöppnad!');
    }
}
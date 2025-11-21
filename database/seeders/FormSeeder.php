<?php

namespace Database\Seeders;

use App\Models\Form;
use Illuminate\Database\Seeder;

class FormSeeder extends Seeder
{
    public function run(): void
    {
        $form = Form::create([
            'title' => 'Hitta din nästa bil',
            'slug' => 'hitta-din-nasta-bil',
            'description' => 'Berätta för oss vad du söker, så hittar vi rätt bil för dig.',
            'success_message' => 'Tack för dina svar! Vi kommer snart med personliga bilrekommendationer.',
            'submit_button_text' => 'Skicka',
            'is_active' => true,
        ]);

        // Question 1: Vad ska bilen användas till?
        $question1 = $form->questions()->create([
            'title' => 'Vad ska bilen användas till?',
            'subtitle' => 'Välj det som bäst beskriver din situation',
            'type' => 'multiselect',
            'order' => 1,
            'is_required' => true,
        ]);

        $question1->options()->createMany([
            [
                'label' => 'Pendling',
                'description' => 'Till och från jobbet dagligen',
                'icon' => 'Briefcase',
                'order' => 1,
            ],
            [
                'label' => 'Familjetransport',
                'description' => 'Familjeaktiviteter och vardagsresor',
                'icon' => 'Users',
                'order' => 2,
            ],
            [
                'label' => 'Fritid & hobby',
                'description' => 'Äventyr och hobbyaktiviteter',
                'icon' => 'Mountain',
                'order' => 3,
            ],
            [
                'label' => 'Stadskörning',
                'description' => 'Främst kortare sträckor i stan',
                'icon' => 'Building2',
                'order' => 4,
            ],
        ]);

        // Question 2: Vad är viktigt för dig?
        $question2 = $form->questions()->create([
            'title' => 'Vad är viktigt för dig?',
            'subtitle' => 'Välj vad som är mest viktigt när du ska välja bil',
            'type' => 'single_select',
            'order' => 2,
            'is_required' => true,
        ]);

        $question2->options()->createMany([
            [
                'label' => 'Ekonomi',
                'description' => 'Låga driftskostnader och bra värde',
                'icon' => 'DollarSign',
                'order' => 1,
            ],
            [
                'label' => 'Miljö',
                'description' => 'Låga utsläpp och miljövänlig',
                'icon' => 'Leaf',
                'order' => 2,
            ],
            [
                'label' => 'Komfort',
                'description' => 'Bekvämlighet och utrustning',
                'icon' => 'Armchair',
                'order' => 3,
            ],
        ]);

        // Question 3: Hur långt får bilen ha gått?
        $question3 = $form->questions()->create([
            'title' => 'Hur långt får bilen ha gått?',
            'subtitle' => 'Välj max körsträcka',
            'type' => 'slider',
            'config' => [
                'min' => 0,
                'max' => 20000,
                'step' => 1000,
                'unit' => 'mil',
            ],
            'order' => 3,
            'is_required' => true,
        ]);
    }
}

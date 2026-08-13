<?php

namespace Database\Seeders\MediaGallery;

use App\Models\Event;
use App\Models\MediaGallery;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MediaGalleryTableSeeder extends Seeder
{
    public function run(): void
    {

        $mediaMap = [
            1 => [
                [

                    'file_type' => 'images',
                    'file_url' => '/storage/images/MediaGallery/1-Techwiz.jpg',
                    'file_name' => 'techwiz6_opening.png',
                    'caption' => 'Techwiz 6 official opening ceremony banner',
                    'department' => 'Computer Science',
                    'event_year' => 2025,
                    'is_featured' => 1,
                    'file_size' => 3072,
                    'uploaded_by' => 1,
                    'uploaded_on' => now(),
                ],
            ], 2 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/2-Dangkimonhoc.jpg',
                'file_name' => 'happybee_2025.png',
                'caption' => 'Happy Bee Music Festival promotional banner',
                'department' => 'Student Affairs',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 4096,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],
            ], 3 => [[
                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/3-Webinar.jpg',
                'file_name' => 'freelancing_webinar.png',
                'caption' => 'Official banner for the webinar series "Find Clients. Win Projects. Grow Fast."',
                'department' => 'Global Partnerships',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 3500,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],
            ], 4 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/4-.jpg',
                'file_name' => 'oktoberfest_2025.png',
                'caption' => 'Official Oktoberfest Saigon 2025 banner',
                'department' => 'Student Affairs',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 5120,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 5 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/5-business.jpg',
                'file_name' => 'hcmc_business_summit_2025.png',
                'caption' => 'Official banner of HCMC Business Summit 2025',
                'department' => 'Business Development',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 6144, // giả sử ~6MB
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 6 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/6-hoc.jpg',
                'file_name' => 'english_in_it.png',
                'caption' => 'Seminar banner: Do You Need English to Study IT?',
                'department' => 'FPT Aptech',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 2800,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 7 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/7-laptrinh.jpg',
                'file_name' => 'facts_about_programming.png',
                'caption' => 'Educational banner: Facts You Need to Know About Programming',
                'department' => 'FPT Aptech',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 2950,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 8 => [[

                'file_type' => 'images',
                'file_url' => 'u/storage/images/MediaGallery/8-sontung.jpg',
                'file_name' => 'happybee15_sontung.png',
                'caption' => 'Son Tung M-TP returns to Happy Bee 15 in Hanoi',
                'department' => 'FPT Polytechnic',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 3250,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 9 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/9-Beaches.jpg',
                'file_name' => 'beauty_of_beaches.png',
                'caption' => 'Beauty of Beaches – A student project by FPT Aptech',
                'department' => 'FPT Aptech',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 2870,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 10 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/10-thitrungket.jpg',
                'file_name' => 'vietfuture2025.png',
                'caption' => 'Vietfuture 2025 – Online Final Round Banner',
                'department' => 'Startup Programs',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 3100,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 11 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/11-congai.jpg',
                'file_name' => 'women_in_it.png',
                'caption' => 'Women in IT campaign banner',
                'department' => 'FPT Aptech',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 2800,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 12 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/12-tuvan.jpg',
                'file_name' => 'ats_fair_hanoi.png',
                'caption' => 'ATS Study Abroad & Scholarship Festival 2025 - Hanoi',
                'department' => 'ATS',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 3500,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],
            ], 13 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/12-tuvan.jpg',
                'file_name' => 'ats_fair_hcm.png',
                'caption' => 'ATS Study Abroad & Scholarship Festival 2025 - Ho Chi Minh City',
                'department' => 'ATS',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 3600,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],
            ], 14 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/13-chillshop.jpg',
                'file_name' => 'workshop_seashell_candles.png',
                'caption' => 'Seashell Scented Candle Workshop at Nha Bon Lam',
                'department' => 'Nha Bon Lam',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 2500,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],
            ], 15 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/13-chillshop.jpg',
                'file_name' => 'workshop_free_colors.png',
                'caption' => 'Free Colors Painting Workshop at Nha Bon Lam',
                'department' => 'Nha Bon Lam',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 2600,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 16 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/14-boosterday.jpg',
                'file_name' => 'ielts_booster_day_hanoi.png',
                'caption' => 'IELTS BOOSTER DAY 2025 - Hanoi official banner',
                'department' => 'IDP Education',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 3200,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],
            ], 17 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/14-boosterday.jpg',
                'file_name' => 'ielts_booster_day_hcm.png',
                'caption' => 'IELTS BOOSTER DAY 2025 - Ho Chi Minh City official banner',
                'department' => 'IDP Education',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 3300,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 18 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/15-Thietkebupbe.jpg',
                'file_name' => 'saigon_song_workshop.png',
                'caption' => 'Saigon Sống Workshop 2025 official banner',
                'department' => 'Saigon Song',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 2800,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 19 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/16-polaris.jpg',
                'file_name' => 'workshop_polaris.png',
                'caption' => 'Workshop POLARIS official banner - Set The Way, Seize The Day',
                'department' => 'Youth For Chance',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 3200,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 20 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/20-englishimprove.jpg',
                'file_name' => 'us_study_abroad_webinar.png',
                'caption' => 'U.S. Study Abroad Webinar - Early Decision & Early Action Strategies',
                'department' => 'Admissions Consulting',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 3500,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 21 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/18-camhoa.jpg',
                'file_name' => 'whispering_petals.png',
                'caption' => 'Whispering Petals – Flower Arrangement Workshop ',
                'department' => 'V’s Garden',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 3600,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 22 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/19-canon.jpg',
                'file_name' => 'canon_roadshow.png',
                'caption' => 'Canon Roadshow 2025 – Hands-on printing experience',
                'department' => 'Vui In Ấn',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 4200,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 23 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/19-canon.jpg',
                'file_name' => 'canon_promotion.png',
                'caption' => 'Special promotions and vouchers at Canon Roadshow 2025',
                'department' => 'Canon Le Bao Minh',
                'event_year' => 2025,
                'is_featured' => 0,
                'file_size' => 3500,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 24 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/21-developingfilm.jpg',
                'file_name' => 'film_workshop.png',
                'caption' => 'Black & White Film Developing Workshop – Saigon Film Photowalk',
                'department' => 'Saigon Film Photowalk',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 4800,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 25 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/22-yourbusinessready.jpg',
                'file_name' => 'forvis_mazars_workshop.png',
                'caption' => 'Workshop on Decree 90/2025/NĐ-CP – Forvis Mazars Vietnam',
                'department' => 'Forvis Mazars Vietnam',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 5120,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 26 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/23-keobong.jpg',
                'file_name' => 'lg_cotton_candy.png',
                'caption' => 'Another Saigon by LG - Cotton Candy Workshop',
                'department' => 'LG Global',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 4820,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 27 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/24-lightup.jpg',
                'file_name' => 'lightup_your_taste.png',
                'caption' => 'LightUp Your Taste – Food Lighting Festival 2025',
                'department' => 'The LightUp',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 5120,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 28 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/25-swingdance.jpg',
                'file_name' => 'xoaystudio_arnas.png',
                'caption' => 'Special Workshop with Arnas Razgūnas – Xoay Studio Saigon 2025',
                'department' => 'Xoay Studio',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 4096,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 29 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/26-leonui.jpg',
                'file_name' => 'crescentwall_endurance.png',
                'caption' => 'Climbing Endurance Workshop – Crescent Wall',
                'department' => 'Crescent Wall',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 3500,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 30 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/27-asus.jpg',
                'file_name' => 'asus_ai_workshop.png',
                'caption' => 'AI Applications – Optimizing Learning with ASUS',
                'department' => 'SCAMP 2025',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 4200,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 31 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/28-chiong.jpg',
                'file_name' => 'organic_vibes.png',
                'caption' => 'Organic Vibes – Organic Agriculture Experience Fair at FPT University HCMC',
                'department' => 'Organic Easy with Gen G',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 4600,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],], 32 => [[

                'file_type' => 'images',
                'file_url' => '/storage/images/MediaGallery/29-robot.jpg',
                'file_name' => 'fptu_ai_robotics_2025.png',
                'caption' => 'FPTU AI & Robotics Challenge 2025 – National Technology Playground for High School Students',
                'department' => 'FPT University HCMC',
                'event_year' => 2025,
                'is_featured' => 1,
                'file_size' => 5200,
                'uploaded_by' => 1,
                'uploaded_on' => now(),
            ],],
            33 => [
                [
                    'file_type' => 'images',
                    'file_url' => '/storage/images/MediaGallery/30-realestate.jpg',
                    'file_name' => 'proptech_vietnam_2025.png',
                    'caption' => 'PropTech Vietnam Network – Exclusive Real Estate Investment Evening',
                    'department' => 'PropTech Vietnam',
                    'event_year' => 2025,
                    'is_featured' => 1,
                    'file_size' => 4300,
                    'uploaded_by' => 1,
                    'uploaded_on' => now(),
                ],
            ],
        ];

        foreach ($mediaMap as $eventId => $items) {
            $event = Event::find($eventId);

            if ($event) {
                foreach ($items as $item) {
                    MediaGallery::create([
                        'event_id' => $event->event_id, // sửa từ $event->id
                        'file_type' => $item['file_type'],
                        'file_url' => $item['file_url'],
                        'file_name' => $item['file_name'],
                        'caption' => $item['caption'],
                        'department' => $event->category ?? null,
                        'event_year' => $item['event_year'] ?? date('Y', strtotime($event->start_at)),
                        'is_featured' => 1,
                        'file_size' => 3000,
                        'uploaded_by' => 1,
                        'uploaded_on' => now(),
                    ]);
                }
            }
        }
    }
}

<?php

return [
    'extraDeleteButton' => true,
    'experimentalFeatures' => true,
    'enableDragDrop' => false,
    'expandMenu' => true,
    'expandUngrouped' => false,
    'ungroupedPosition' => 'start',
    'fields' => [
        'contentBuilder' => [
            'groups' => [
                [
                    'label' => \Craft::t('app', 'Basic'),
                    'types' => ['basicContent', 'image'],
                ],
                [
                    'label' => \Craft::t('app', 'Components'),
                    'types' => ['imageContent', 'infoBox', 'cards', 'iconCards', 'stackedCards', 'statsBox', 'checklist', 'accordion', 'featuredBanner', 'cta'],
                ],
                [
                    'label' => \Craft::t('app', 'Layout'),
                    'types' => ['twoColumns', 'container'],
                ]
            ],
        ],
        'column' => [
            'groups' => [
                [
                    'label' => \Craft::t('app', 'Basic'),
                    'types' => ['basicContent', 'image'],
                ],
                [
                    'label' => \Craft::t('app', 'Components'),
                    'types' => ['infoBox', 'statsBox', 'checklist', 'stackedCards'],
                ]
            ],
        ],
        'container' => [
            'groups' => [
                [
                    'label' => \Craft::t('app', 'Basic'),
                    'types' => ['basicContent', 'image'],
                ],
                [
                    'label' => \Craft::t('app', 'Components'),
                    'types' => ['infoBox', 'cards', 'iconCards', 'stackedCards', 'statsBox', 'checklist', 'accordion', 'imageContent', 'twoColumns'],
                ]
            ],
        ]
    ]
];

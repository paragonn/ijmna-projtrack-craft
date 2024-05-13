<?php
return [
    "*" => [
        'allowUpscale' => false,
        'imagerSystemPath' => '@webroot/imager',
        //'imagerUrl' => rtrim(getenv('PRIMARY_SITE_URL'), '/') . '/imager',
        'addVolumeToPath' => false,
        'suppressExceptions' => true,
        'imagerUrl' => rtrim(getenv('SPACES_BASE_URL'), '/') . '/' . (getenv('SPACES_SUBFOLDER') != '' ? getenv('SPACES_SUBFOLDER') . '/' : '') . 'imager',
        'storages' => ['dospaces'],
        'storageConfig' => [
            'dospaces' => [
                'endpoint' => getenv('SPACES_ENDPOINT'),
                'accessKey' => getenv('SPACES_ACCESS_KEY_ID'),
                'secretAccessKey' => getenv('SPACES_SECRET_ACCESS_KEY'),
                'region' => getenv('SPACES_REGION'),
                'bucket' => getenv('SPACES_BUCKET'),
                'folder' => (getenv('SPACES_SUBFOLDER') != '' ? getenv('SPACES_SUBFOLDER') . '/' : '') . 'imager',
                'requestHeaders' => array(),
            ]
    ],
        'transformer' => 'craft',
        'cacheEnabled' => true,
        'cacheRemoteFiles' => true,
        'cacheDuration' => 31536000, // 1 year
        'cacheDurationRemoteFiles' => 31536000, // 1 year
        'cacheDurationExternalStorage' => 31536000, // 1 year
        'cacheDurationNonOptimized' => 300, // 1 year
        'hashPath' => true,
        /*'jpegoptimEnabled' => false,
        'optipngEnabled' => true,
        'mozjpegEnabled' => true,
        'mozjpegPath' => '/usr/bin/mozjpeg',*/
        'jpegQuality' => 30,
        'pngCompressionLevel' => 0,
        'pngCompressionLevel' => 0,
        'allowUpscale' => false,
        'smartResizeEnabled' => false,
        'removeMetadata' => true,

        'fillTransforms' => true,
        'fillInterval' => '200',
        'interlace' => 'line',
        'safeFileFormats' => ['jpg', 'jpeg', 'png'],
        'optimizers' => ['jpegoptim', 'optipng'],
        'optimizeType' => 'job',
        'optimizerConfig' => [
            'jpegoptim' => [
                'extensions' => ['jpg'],
                'path' => getenv('JPEGOPTIM_PATH'),
                'optionString' => '-s',
            ],
            'optipng' => [
                'extensions' => ['png'],
                'path' => getenv('OPTIPNG_PATH'),
                'optionString' => '-o2 -strip all',
            ],

            /*'mozjpeg' => [
                'extensions' => ['jpg', 'jpeg'],
                'path' => '/usr/bin/mozjpeg',
                'optionString' => '-optimize -copy none',
            ],
            'pngquant' => [
                'extensions' => ['png'],
                'path' => '/usr/bin/pngquant',
                'optionString' => '--strip --skip-if-larger',
            ],

            'gifsicle' => [
                'extensions' => ['gif'],
                'path' => '/usr/bin/gifsicle',
                'optionString' => '--optimize=3 --colors 256',
            ],*/
        ],
        'customEncoders' => [
            'webp' => [
                'path' => getenv('CWEBP_PATH'),
                'options' => [
                    'quality' => 80,
                    'effort' => 2, //compression method (0=fast, 6=slowest), default=4
                ],
                'paramsString' => '-q {quality} -m {effort} {src} -o {dest}',
            ]
        ],
    ],

    "dev" => [
        'curlOptions' => array(
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSLVERSION => 1,
            CURLOPT_SSL_CIPHER_LIST => 'TLSv1'
        ),
    ]
];

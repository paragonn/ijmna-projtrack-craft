// Per line a class so we can track them on git
var whitelist = [
	// Static classes to exlude
	// /mfp-bg$/,
	/arrow-link$/,

	// Patterns to be exlude. (regex)
	/slick-/,
	/mfp-/,
	/fancybox-/,
	/btn--/,
	/svg--/,
	/color--/,
	/fg--/,
	/bg--/,
	/aos-/
];

module.exports = { whitelist };
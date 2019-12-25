//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRobotsRoute: {
			OLSKRoutePath: '/robots.txt',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction (req, res, next) {
				return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'view'), {
					WKCRobotsAllowedRouteConstants: process.env.WKC_ROBOTS_ALLOWED === 'true' ? [
						'KVCRefHomeRoute',
					] : [],
				});
			},
		},
	};
};

var COD = COD || {};

(function(COD, $) {

    COD.api = COD.api || {};

    COD.api.dev     = window.location.hostname.indexOf('cmsauthor') >= 0;
    COD.api.preview = window.location.hostname.indexOf('preview') >= 0;
    COD.api.stage   = window.location.hostname.indexOf('stage') >= 0;

    COD.api.cache = {};

    COD.api.error = function(call, error) {
        return 'API error: ' + error + ' (' + call + ').';
    };

    COD.api.ajax = function(url, opts, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        var request = {
            url: url,
            type: 'GET',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            }
        };

        var req = $.extend(request, opts);

        return $.ajax(req).success(function(res) {
            if (!res) {
                error(COD.api.error(url, 'empty response'));
                return;
            }
            callback(res);
        }).fail(function(err) {
            error(COD.api.error(url, err.statusText));
        });
    };

    COD.api.cacheify = function(url, data) {
        COD.api.cache[url] = {
            data: data,
            timestamp: Date.now()
        };
    };

    COD.api.get = function(url, callback, error, cache) {
        var currentTime = Date.now();
        var cacheAPI = COD.api.cache;
        var expiration = (5 * 60) * 1000; // FIVE MINS
        var isCacheable = cache !== false;

        if (isCacheable) {
            if(cacheAPI[url] && ((currentTime - cacheAPI[url].timestamp) < expiration)) {
                callback(cacheAPI[url].data);
            } else {
                COD.api.ajax(url, {}, function(res){
                    COD.api.cacheify(url, res);
                    callback(res);
                }, error);
            }
        } else {
            COD.api.ajax(url, {}, function(res){
                callback(res);
            }, error);
        }

    };

    COD.api.post = function(url, data, callback, error) {
        var opts = {
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json'
        };
        COD.api.ajax(url, opts, callback, error);
    };

    COD.api.put = function(url, data, callback, error) {
        var opts = {
            type: 'PUT',
            data: JSON.stringify(data),
            contentType:'application/json'
        };
        COD.api.ajax(url, opts, callback, error);
    }

    COD.api.delete = function(url, callback, error) {
        COD.api.post(url, {}, callback, error);
    };

    COD.api.buildQueryString = function(queryObj) {
        queryObj = queryObj || {};
        var queryStringComponents = Object.keys(queryObj).map(function(name) {
            if (queryObj[name]) {
                return name + '=' + queryObj[name];
            }
        });
        return queryStringComponents.length ? '?' + queryStringComponents.join('&') : '';
    };

    COD.api.editQueryString = function(url, queryObj) {
        var qObj = $.extend({}, queryObj || {});
        var urlQuery = url.split('?');
        if (urlQuery.length < 2) return url + COD.api.buildQueryString(qObj);
        var qUrl = urlQuery[0];
        var qParams = urlQuery[1];
        var qParamsSplit = qParams.split('&');
        $.each(qParamsSplit, function(i, qItem) {
            var qItemSplit = qItem.split('=');
            var qItemKey = qItemSplit[0];
            var qItemVal = qItemSplit[1];
            qObj[qItemKey] = qObj[qItemKey] || qItemVal;
        });
        return qUrl + COD.api.buildQueryString(qObj);
    };


}(COD, jQuery));


var COD = COD || {};
var ATVI = ATVI || {};

(function(COD, ATVI, $) {
    COD.api = COD.api || {};
    COD.api.papi = COD.api.papi || {};

    COD.api.papi.url = '/api/papi-client/';
    if (COD.api.dev) {
        COD.api.papi.url = 'https://stage.callofduty.com/api/papi-client/';
    }

    COD.api.papi.error = function(endpoint, error) {
        return 'API error: ' + error + ' (' + endpoint + ').';
    };

    COD.api.papi.get = function(endpoint, callback, error) {
        var url = COD.api.papi.url + endpoint;
        return COD.api.get(url, callback, error);
    };

    COD.api.papi.post = function(endpoint, data, callback, error) {
        var url = COD.api.papi.url + endpoint;
        return COD.api.post(url, data, callback, error);
    };

	COD.api.papi.put = function(endpoint, data, callback, error) {
        var url = COD.api.papi.url + endpoint;
        return COD.api.put(url, data, callback, error);
    };

    COD.api.papi.leaderboard = function(opts, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};
        opts = opts || {};
        var pageType = opts.pageType || 'page';
        var gameType = opts.gameType || 'core';
        var endpoint = [
            'leaderboards', 'v2',
            'title', opts.game,
            'platform', opts.platform,
            'time', opts.dateRange,
            'type', gameType,
            'mode', opts.gameMode,
            pageType, opts.page
        ];
        if(opts.group && opts.group != "all"){
            endpoint.push(opts.group);
        }
        endpoint = endpoint.join('/');
        var queryParams = {};
        if (opts.sort) queryParams.sort = opts.sort;
        endpoint = COD.api.editQueryString(endpoint, queryParams);

        if (!opts.game || !opts.platform || !opts.dateRange || !opts.gameMode || !opts.page) {
            var err = COD.api.papi.error(endpoint, 'invalid parameters.');
            error(err);
            return;
        }

        COD.api.papi.get(endpoint, function(res) {
            res = res || {};
            var data = res.data || {};
            if (res.status !== 'success') return error(data.message || res.status);
            return callback(data);
        }, error);
    };


    COD.api.papi.getItems = function(game, platform, idType, id, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        var endpoint = ['inventory', 'v1', 'title', game, 'platform', platform, idType, encodeURIComponent(id), 'inventory'].join('/');

        if (!game || !platform || !idType || !id) {
            return error(COD.api.papi.error(endpoint, 'invalid parameters.'));
        }

        COD.api.papi.get(endpoint, function(res) {
            res = res || {};
            var data = res.data || {};
            if (res.status !== 'success') return error(data.message || res.status);
            return callback(data);
        }, error);
    };

    COD.api.papi.getCurrency = function(game, platform, idType, id, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        var endpoint = ['inventory', 'v1', 'title', game, 'platform', platform, idType, encodeURIComponent(id), 'currency'].join('/');

        if (!game || !platform || !idType || !id) {
            return error(COD.api.papi.error(endpoint, 'invalid parameters.'));
        }

        COD.api.papi.get(endpoint, function(res) {
            res = res || {};
            var data = res.data || {};
            if (res.status !== 'success') return error(data.message || res.status);
            return callback(data);
        }, error);
    };

    COD.api.papi.purchaseItem = function(itemName, game, platform, idType, id, currencyType, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        var endpoint = ['inventory', 'v1', 'title', game, 'platform', platform, idType, encodeURIComponent(id), 'item', itemName, 'purchaseWith', currencyType].join('/');

        if (!itemName || !game || !platform || !idType || !id || !currencyType) {
            return error(COD.api.papi.error(endpoint, 'invalid parameters.'));
        }

        COD.api.papi.post(endpoint, null, function(res) {
            res = res || {};
            var data = res.data || {};
            if (res.status !== 'success') return error(data.message || res.status);
            return callback(data);
        }, error);
    };

    COD.api.papi.redeemCrate = function(crateRarity, game, platform, idType, id, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        var endpoint = ['inventory', 'v1', 'title', game, 'platform', platform, idType, encodeURIComponent(id), 'item', crateRarity, 'redeem'].join('/');

        if (!crateRarity || !game || !platform || !idType || !id) {
            return error(COD.api.papi.error(endpoint, 'invalid parameters.'));
        }

        COD.api.papi.post(endpoint, null, function(res) {
            res = res || {};
            var data = res.data || {};
            if (res.status !== 'success') return error(data.message || res.status);
            return callback(data);
        }, error);
    };

    COD.api.papi.loadoutWeapons = function(game, platform, gamertag, callback, error) {

        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};
        game = game || "bo4";

        var endpoint = `loadouts/v3/title/${game}/items/mode/mp/${ATVI.pageLocale.toLocaleLowerCase()}`;

        COD.api.papi.get(endpoint, function(res){
            if(res.status == "error"){
                error(res.data);
            } else {
                callback(res.data);
            }
        })
    }

    COD.api.papi.loadoutClasses = function(game, platform, gamertag, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {}; 
        game = game || "bo4";

        var endpoint = ['loadouts/v3/title', game, 'platform', platform, 'gamer', encodeURIComponent(gamertag), 'mode/mp'].join('/');

        COD.api.papi.get(endpoint, function(res){
            if(res.status == "error") {
                error(res.data)
            } else {
                callback(res.data);
            }
        });
    }

    //https://stage.callofduty.com/api/papi-client/loadouts/v3/title/bo4/platform/xbl/gamertag/javagamer/mode/mp/slot/1
    COD.api.papi.submitLoadoutClass = function(game, platform, gamertag, slot, data, callback, error){
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {}; 
        game = game || "bo4";

        var endpoint = ['loadouts/v3/title', game, 'platform', platform, 'gamer', gamertag, 'mode/mp/slot', slot].join('/');

        COD.api.papi.post(endpoint, data, callback, error);
    }

    COD.api.papi.userFeed = function (payload, callback, error) {
        var path = `userfeed/v1/friendFeed/rendered/${ATVI.pageLocale.toLocaleLowerCase()}/${payload.hashId}`;
        var endpoint = COD.api.papi.url + path;
        COD.api.get(endpoint, callback, error);
    };

    COD.api.papi.fetchMatchAnalysis = function (payload, callback, error) {
        var path = `ce/v2/title/${payload.game}/platform/${payload.platform}/gametype/${payload.type}/gamer/${encodeURIComponent(payload.username)}/summary/match_analysis/contentType/full/end/${payload.timestamp}/matchAnalysis/mobile/${ATVI.pageLocale.toLocaleLowerCase()}`;
        var endpoint = COD.api.papi.url + path;
        COD.api.get(endpoint, callback, error);
    };

    COD.api.papi.fetchBrief = function (payload, callback, error) {
        var path = `ce/v1/title/${payload.game}/platform/${payload.platform}/gametype/${payload.type}/gamer/${encodeURIComponent(payload.username)}/brief/mobile/${ATVI.pageLocale.toLocaleLowerCase()}`;
        var endpoint = COD.api.papi.url + path;
        COD.api.get(endpoint, callback, error);
    };

    COD.api.papi.fetchDebrief = function (payload, callback, error) {
        var path = `ce/v1/title/${payload.game}/platform/${payload.platform}/gametype/${payload.type}/gamer/${encodeURIComponent(payload.username)}/debrief/mobile/${ATVI.pageLocale.toLocaleLowerCase()}`;
        var endpoint = COD.api.papi.url + path;
        COD.api.get(endpoint, callback, error);
    };

    COD.api.papi.fetchMapModes = function (payload, callback, error) {
        var path = `ce/v1/title/${payload.game}/platform/${payload.platform}/gameType/${payload.type}/communityMapData/availability`;
        var endpoint = COD.api.papi.url + path;
        COD.api.get(endpoint, callback, error);
    };

    COD.api.papi.fetchFriendRelationships = function (callback, error) {
        var hash = COD.api.sso.hashId();
        var path = `relationships/v1/list/${hash}`;
        var endpoint = COD.api.papi.url + path;
        COD.api.get(endpoint, callback, error, false);
    };

    COD.api.papi.createFriendRelationship = function (payload, callback, error) {
        var path = `relationships/v1/friend/platform/${payload.platform}/gamer/${encodeURIComponent(payload.username)}/set/${payload.type}`;
        var endpoint = COD.api.papi.url + path;
        COD.api.post(endpoint, payload, callback, error);
    };

    COD.api.papi.deleteFriendRelationship = function (payload, callback, error) {
        var path = `relationships/v1/friend/platform/${payload.platform}/gamer/${encodeURIComponent(payload.username)}/delete`;
        var endpoint = COD.api.papi.url + path;
        COD.api.delete(endpoint, callback, error);
    };

    COD.api.papi.fetchLootStreamSeason = function (payload, callback, error) {
        var path = `loot/title/${payload.game}/platform/${payload.platform}/list/${payload.season}/${ATVI.pageLocale.toLocaleLowerCase()}`;
        var endpoint = COD.api.papi.url + path;
        COD.api.get(endpoint, callback, error);
    };

    COD.api.papi.fetchLootStreams = function (payload, callback, error) {
        var path = `loot/title/${payload.game}/platform/${payload.platform}/gamer/${encodeURIComponent(payload.gamer)}/status/${ATVI.pageLocale.toLocaleLowerCase()}`;
        var endpoint = COD.api.papi.url + path;
        COD.api.get(endpoint, callback, error);
    };
    
})(COD, ATVI, jQuery);

var COD = COD || {};

(function(COD, $) {

    COD.api = COD.api || {};
    COD.api.papi = COD.api.papi || {};
    COD.api.papi.crm = COD.api.papi.crm || {};

    COD.api.papi.crm.path = 'crm/';

    COD.api.papi.crm.get = function(endpoint, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        var endpoint = COD.api.papi.crm.path + endpoint;
        return COD.api.papi.get(endpoint, callback, function(err) {
            error('CRM ' + err);
        });
    };

    COD.api.papi.crm.identities = function(callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        var hashId = COD.api.sso.hashId();
        if (!hashId) {
            return error(COD.api.papi.error(endpoint, 'Cannot load SSO identities. No hashId id present in cookies.'));
        }

        var endpoint = ['cod', 'v2', 'identities', hashId].join('/');
        if (COD.api.dev) {
            var unoId = COD.api.sso.unoId();
            endpoint = ['cod', 'v2', 'identities', 'platform', 'uno', 'id', unoId].join('/');
        }

        COD.api.papi.crm.get(endpoint, function(res) {
            res = res || {};
            var data = (res.data || {}).titleIdentities || [];
            if (res.status !== 'success') return error(data.message || res.status);
            return callback(data);
        }, error);
    };
    COD.api.papi.crm.profile = function(game, platform, idType, id, type, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};
        
        if(!type) {
            type = 'mp';
        } 

        var endpoint = ['cod', 'v2', 'title', game, 'platform', platform, idType, encodeURIComponent(id), 'profile/type', type].join('/');

        if (!game || !platform || !idType || !id) {
            return error(COD.api.papi.error(endpoint, 'invalid parameters.'));
        }
   
        COD.api.papi.crm.get(endpoint, function(res) {
            res = res || {};
            var data = res.data || {};
            data.type = type;
            
            if (res.status !== 'success') return error(data.message || res.status);
            return callback(data);
        }, error);
    };

    COD.api.papi.crm.avatar = function(platform, id, callback, error) {
        // /api/papi-client/crm/cod/v2/platform/psn/gamer/oorangecchicken/avatar
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        if(!platform || !id) {
            return error(COD.api.papi.error(endpoint, 'invalid avatar parameters'));
        }
        var url = `cod/v2/platform/${platform}/gamer/${encodeURIComponent(id)}/avatar`;

        COD.api.papi.crm.get(url, function(res){
            if(res.status !== "success") return error(res.message || res.status);
            return callback(res.data);
        }, error);
    }

    COD.api.papi.crm.recentXDaysMatches = function(game, platform, idType, id, days, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        days = days || 7;

        if (!game || !platform || !idType || !id) {
            var err = COD.api.papi.error(endpoint, 'invalid parameters).');
            return error(err);
        }

        var endpoint = ['cod', 'v2', 'title', game, 'platform', platform, idType, encodeURIComponent(id), 'matches', 'days', days].join('/');

        COD.api.papi.crm.get(endpoint, function(res) {
            res = res || {};
            if (res.status !== 'success') return error(data.message || res.status);
            var data = res.data || [];
            if (!data.matches) return callback(data);
            $.each(data.matches, function(i, m) {
                m.duration = m.utcEndSeconds - m.utcStartSeconds;
                m.playerStats.scorePerMinute = Math.round(m.playerStats.score / (m.duration || 1) * 60);
            });
            return callback(data);
        }, error);
    };

    COD.api.papi.crm.recentMatchesTimestamp = function(game, platform, idType, id, type, start, end, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        start = start || 0;
        end = end || 0;
        type = type || 'mp';

        if (!game || !platform || !idType || !id ) {
            var err = COD.api.papi.error(endpoint, 'invalid parameters).');
            return error(err);
        }

        var endpoint = ['cod', 'v2', 'title', game, 'platform', platform, idType, encodeURIComponent(id), 'matches', type, 'start', start, 'end', end, 'details'].join('/');

        

        COD.api.papi.crm.get(endpoint, function(res) {
            res = res || {};
            var data = res.data || [];
            if (res.status !== 'success') return error(data.message || res.status);
            
            if (!data.matches) return callback(data);
            $.each(data.matches, function(i, m) {
                m.duration = m.utcEndSeconds - m.utcStartSeconds;
                m.playerStats.scorePerMinute = Math.round(m.playerStats.score / (m.duration || 1) * 60);
            });
            return callback(data);
        }, error);
    }

    COD.api.papi.crm.recentMatchesBasic = function(game, platform, idType, id, type, start, end, limit, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        start = start || 0;
        end = end || 0;

        if (!game || !platform || !idType || !id) {
            var err = COD.api.papi.error(endpoint, 'invalid parameters).');
            return error(err);
        }

        var endpoint = ['cod', 'v2', 'title', game, 'platform', platform, idType, encodeURIComponent(id), 'matches/mp', 'start', start, 'end', end].join('/');

        if(limit && limit > 0) {
            endpoint += "?limit=" + limit;
        }
        

        COD.api.papi.crm.get(endpoint, function(res) {
            res = res || {};
            if (res.status !== 'success') return error(data.message || res.status);
            var data = res.data || [];
            if (!data.matches) return callback(data);
            $.each(data.matches, function(i, m) {
                m.duration = m.utcEndSeconds - m.utcStartSeconds;
                m.playerStats.scorePerMinute = Math.round(m.playerStats.score / (m.duration || 1) * 60);
            });
            return callback(data);
        }, error);
    }

    COD.api.papi.crm.weeklyRecap = function(game, platform, idType, id, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        var endpoint = ['cod', 'v2', 'title', game, 'platform', platform, idType, id, 'summary'].join('/');

        if (!game || !platform || !idType || !id) {
            return error(COD.api.papi.error(endpoint, 'invalid parameters.'));
        }

        COD.api.papi.crm.get(endpoint, function(res) {
            res = res || {};
            var data = res.data || {};
            if (res.status !== 'success') return error(data.message || res.status);
            return callback(data);
        }, error);
    };

    COD.api.papi.crm.ssoMotd = function(game, platform, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        var lang = ATVI.utils.parseLocalizedPath(location.pathname.replace('/iw','/'));
        var locale =  lang.language + '-' +  lang.region.toUpperCase();
        var atviToken = ATVI.utils.getCookie('ACT_SSO_COOKIE');
        var motdParameter = ( atviToken !== undefined  && atviToken !== null ) ? '&token=' + atviToken : '';
        var endpoint = ['v1', 'messages', 'motd', game, platform].join('/');

        endpoint = endpoint + '?lang=' + locale + motdParameter;

        if (!game) {
            return error(COD.api.papi.error(endpoint, 'invalid parameters.'));
        }

        COD.api.papi.crm.get(endpoint, function(res) {
            var data = res.data || {};
            if (res.status !== 'success') return error(data.message || res.status);
            var message = data.message || {};
            message.id = data.messageID;
            message.title = message.title || '';
            message.content_long = message.content_long || '';
            message.content_long = message.content_long.replace(/(<([^>]+)>)/ig, '');
            callback(message);
        });
    };

    COD.api.papi.crm.friends = function(platform, username, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};
        platform = platform || "psn";

        if(username == null){ return error(COD.api.papi.error(endpoint, "no username provided in friends call")); }
        var hashId = COD.api.sso.hashId();
        if (!hashId) {
            return error(COD.api.papi.error(endpoint, 'Cannot load SSO identities. No hashId id present in cookies.'));
        }

        var endpoint = ['cod', 'v2', 'friends', 'platform', platform, 'gamer', encodeURIComponent(username), 'presence', '1', hashId].join('/');

        COD.api.papi.crm.get(endpoint, function(res){
            res = res || {};
            var data = res.data || [];
            if (res.status !== 'success') return error(data.message || res.status);

            return callback(data);
        });
    }

    COD.api.papi.crm.friendsProfile = function(game, platform, username, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};
        platform = platform || "psn";
        game = game || "wwii";

        if(username == null){ return error(COD.api.papi.error(endpoint, "no username provided in friends profile call")); }
       

        var endpoint = ['cod', 'v2', 'title', game, 'platform', platform, 'gamer', encodeURIComponent(username), 'profile', 'friends'].join('/');

        COD.api.papi.crm.get(endpoint, function(res){
            res = res || {};
            var data = res.data || [];
            if (res.status !== 'success') return error(data.message || res.status);
           

            return callback(data);
        });
    }

    COD.api.papi.crm.globalStats = function(game, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {}; 
        game = game || "wwii";

        var endpoint = "cod/v2/title/" + game +"/community";

        COD.api.papi.crm.get(endpoint, function(res){
            res = res || {};
            if (res.status !== 'success') return error(data.message || res.status);

            var data = res.data || {};

            return callback(data);
        });
    }

     COD.api.papi.crm.zombiesAuth = function(game, platform, username, code, callback, error ) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {}; 
        game = game || "bo4";
        username = encodeURIComponent(username);
        code = encodeURIComponent(code);

        //https://stage.callofduty.com/api/papi-client/zmauth/v1/title/bo4/platform/psn/gamer/quechuan140/zombies/match/authenticated/phrase/Nearly%20Agonizing%20Short%20Corpses
        var endpoint = ["zmauth/v1/title", game, "platform", platform, "gamer", username, "zombies/match/authenticated/phrase", code].join('/');
        console.log(endpoint);
        COD.api.papi.get(endpoint, function(res) {
            if(res.status !== 'success') return error(res);

            return callback(res.data);
        })
        //callback({"gameLength":263850,"map":"zm_towers","numZombieRounds":4,"roundEnd":4,"downCount":3,"difficulty":1,"gameType":"zclassic","playerStats":{"brutusesKilled":0.0,"killedByCatalystCorrosive":0.0,"ballisticKnivesPickedup":0.0,"meleeKills":13.0,"instaKillPickedup":0.0,"doorsPurchased":0.0,"score":4790.0,"specialtyDeadshotDrank":0.0,"totalXp":2525.0,"startXp":229900.0,"totalShots":60.0,"specialtyFlakjacketDrank":0.0,"endRank":17.0,"specialtyAdditionalprimaryweaponDrank":0.0,"perksDrank":0.0,"killedByCatalystElectric":0.0,"killedByCatalystWater":0.0,"killedByNovaCrawler":0.0,"scoreEarned":3210.0,"powerTurnedon":0.0,"deaths":1.0,"catalystWatersKilled":0.0,"specialtyLongersprintDrank":0.0,"wallbuyWeaponsPurchased":1.0,"windowsBoarded":1.0,"killedByCatalystPlasma":0.0,"downs":6.0,"killedByGladiator":0.0,"prestige":0.0,"revives":2.0,"killedByBrutus":0.0,"bgbsChewed":2.0,"tigersKilled":0.0,"wonderWeaponKills":0.0,"suicides":0.0,"doublePointsPickedup":0.0,"grenadeKills":0.0,"specialtyQuickreviveDrank":0.0,"screecherMinigamesWon":0.0,"startRank":17.0,"killedByHellhound":0.0,"shieldsPurchased":0.0,"powerTurnedoff":0.0,"contaminationsReceived":0.0,"failedSacrifices":0.0,"kills":27.0,"nukePickedup":0.0,"scoreSpent":1400.0,"fullAmmoPickedup":0.0,"buildablesBuilt":0.0,"hellhoundsKilled":0.0,"boards":8.0,"failedRevives":0.0,"killedByAvogadro":0.0,"drops":2.0,"headshots":1.0,"catalystPlasmasKilled":0.0,"novaCrawlersKilled":0.0,"killedByBlightfather":0.0,"misses":13.0,"meatStinkPickedup":0.0,"claymoresPickedup":0.0,"killedByTiger":0.0,"specialtyScavengerDrank":0.0,"catalystsKilled":0.0,"contaminationsGiven":0.0,"zdogsKilled":0.0,"distanceTraveled":37976.0,"avogadroDefeated":0.0,"sacrifices":0.0,"gladiatorsKilled":0.0,"hitsTaken":15.0,"plantedBuildablesPickedup":0.0,"upgradedAmmoPurchased":0.0,"killedByCatalyst":0.0,"screecherTeleportersUsed":0.0,"blightfathersKilled":0.0,"screechersKilled":0.0,"specialtyArmorvestDrank":0.0,"carpenterPickedup":0.0,"claymoresPlanted":0.0,"screecherMinigamesLost":0.0,"hits":52.0,"specialtyRofDrank":0.0,"endXp":232425.0,"catalystElectricsKilled":0.0,"catalystCorrosivesKilled":0.0,"killedByZdog":0.0,"distanceSprinted":0.0,"specialtyFastreloadDrank":0.0,"ammoPurchased":0.0},"gameSettings":{"teamKillScore":4.0,"antiBoostDistance":0.0,"zmTalismanPerkModSingle":true,"zmWalkerState":0.0,"maxAllowedPrimaryAttachments":0.0,"zmHeadshotsOnly":false,"cleansedLoadout":false,"forwardSpawnTakesDamage":false,"presetClassesPerTeam":false,"zmZombieMaxSpeed":3.0,"zmTalismanExtraSemtex":true,"robotShield":false,"leaderBonus":0.0,"zmZombieHealthMult":1.0,"silentPlant":false,"draftMatchStartTime":3.0,"forwardSpawnIsNeutral":false,"friendlyEquipmentKeylines":false,"killstreaksGiveGameScore":false,"zmPerksSecretSauce":true,"destroyTime":0.0,"disallowprone":false,"zmMysteryBoxLimitMove":0.0,"zmElixirJoinTheParty":true,"zmPopcornDamageMult":1.0,"zmRunnerState":0.0,"pregameCACModifyTime":0.0,"timePausesWhenInZone":false,"zmHeavySpawnFreq":1.0,"disableCAC":true,"flagCaptureRateIncrease":false,"incrementalSpawnDelay":1.17549435E-38,"zmTalismanCoagulant":true,"zmTalismanBoxGuaranteeLMG":true,"allowAnnouncer":false,"zmRoundCap":0.0,"zmElixirWallPower":true,"playOfTheMatchBonusSearchTimePerEvent":2.0,"maxPlayerOffensive":0.0,"deployableBarrierExplosiveMultiplier":1.377532E-39,"pregameItemVoteEnabled":false,"ekiaResetOnDeath":false,"zmElixirLicensedContractor":true,"playerKillsMax":0.0,"zmTalismanBoxGuaranteeBoxOnly":true,"killcamTime":2.8E-45,"forwardSpawnHealth":0.0,"startPlayers":0.0,"roundSwitch":1.0,"zmElixirsIndividual":true,"maxTeamPlayers":0.0,"deployableBarrierCanBeDamaged":false,"zmElixirShieldsUp":true,"zmPowerupSharing":true,"carryScore":0.0,"draftHideEnemyTeam":false,"zmElixirsLegendary":true,"deathPointLoss":false,"flagCaptureGracePeriod":0.0,"zmTalismansEpic":true,"deathCircle":false,"zmElixirCrawlSpace":true,"zmElixirFreeFire":true,"gameAdvertisementRuleRoundsWon":0.0,"zmElixirPointDrops":true,"useItemSpawns":false,"zmElixirPopShocks":true,"zmPerksPhdSlider":true,"killPointsInEnemyProtectedZone":0.0,"disableAmbientFx":false,"zmPointsLossType":0.0,"zmTalismanStartWeaponLMG":true,"zmPowerDoorState":1.0,"zmSpecialRoundsEnabled":true,"zmElixirPhantomReload":true,"teamKillPunishCount":3.0,"allowBattleChatter":true,"zmTrapsEnabled":true,"useDoors":true,"zmKillCap":0.0,"infectionMode":0.0,"neutralZone":false,"zmWeaponsTR":true,"fogOfWarMinimap":false,"zmDifficulty":1.0,"zmTalismanSpecialStartLvl2":true,"zmHealthRegenDelay":1.0,"zmTalismanSpecialStartLvl3":true,"flagCanBeNeutralized":false,"zmZombieDamageMult":1.0,"delayPlayer":false,"zmSuperPaPEnabled":true,"zmBotsEnabled":false,"zmPointsLossValue":0.0,"zmLastStandDuration":2.0,"zmElixirAntiEntrapment":true,"teamScorePerKillDenied":0.0,"teamKillPointLoss":false,"zmWallBuysEnabled":true,"zmPowerupCarpenter":true,"zmPointsFixed":false,"forwardSpawnDefaultDisableTime":0.0,"zmTalismanPerkStart4":true,"zmElixirAnywhereButHere":true,"teamAssignment":0.0,"zmTalismanPerkStart1":true,"zmTalismanPerkStart3":true,"zmTalismanPerkStart2":true,"voipDeadHearAllLiving":false,"draftTime":30.0,"disallowaimslowdown":false,"draftEveryRound":false,"playOfTheMatchBonusSearchTimeMaxPerEvent":4.0,"zmHealthOnKill":0.0,"zmSpecWeaponChargeRate":1.0,"roundScoreLimit":0.0,"zmEndOnQuest":false,"playerRespawnDelay":2.3509887E-38,"zmElixirsRare":true,"zmSpecWeaponIsEnabled":true,"zmCatalystAggro":true,"decayCapturedZones":false,"zmHeavyHealthMult":1.0,"roundLimit":1.0,"skipLastStand":false,"teamKillReducedPenalty":5.74E-42,"OvertimetimeLimit":1.6940659E-21,"zmPerksVictorious":true,"idleFlagDecay":false,"playOfTheMatchBlacklistDebuff":2.75515E-40,"zmPerksStaminUp":true,"disableweapondrop":true,"zmPowerupFireSale":true,"zmPopcornState":1.0,"allowSpectating":false,"pointsPerPrimaryKill":0.0,"zmLimitedDownsIsEnabled":false,"pickupTime":0.0,"zmWeaponsSniper":true,"teamKillPenalty":2.0,"zmTalismanStartWeaponAR":true,"decayProgress":false,"pregameItemVoteRoundTime":0.0,"zmWeaponsKnife":true,"zmShieldDurability":1.0,"scoreLimit":7500.0,"scoreResetOnDeath":false,"zmElixirImmolationLiquidation":true,"pregameItemMaxVotes":0.0,"cumulativeRoundScores":false,"roundStartExplosiveDelay":2.2966E-41,"flagDecayTime":0.0,"zmMiniBossDamageMult":1.0,"zmPerksStoneCold":true,"carrierArmor":0.0,"maxPlayOfTheMatchEvents":10.0,"playerSprintTime":3.593E-42,"carrierMoveSpeed":0.0,"zmElixirsEnabled":true,"zmElixirsCooldown":1.0,"gameAdvertisementRuleRound":0.0,"waveRespawnDelay":1.6282582E-27,"roundStartKillstreakDelay":5.92339E-39,"wagermatchhud":false,"allowMapScripting":false,"zmTalismanShieldDurabilityRare":true,"zmMysteryBoxIsLimited":false,"maxAllocation":0.0,"zmElixirRespinCycle":true,"zmTalismansCommon":true,"objectivePingTime":0.0,"zmElixirTemporalGift":true,"ticketsLostOnTimeAmount":0.0,"zmElixirSwordFlay":true,"zmElixirPhoenixUp":true,"gameAdvertisementRuleStopAtGameStart":false,"preroundperiod":0.0,"zmCatalystDamageMult":1.0,"ticketsEarnedAtStageWin4":0.0,"ticketsEarnedAtStageWin3":0.0,"shutdownDamage":0.0,"ticketsEarnedAtStageWin2":0.0,"zmElixirPowerKeg":true,"ticketsEarnedAtStageWin1":0.0,"capDecay":false,"ticketsEarnedAtStageWin0":0.0,"spawnHealthBoostTime":0.0,"pregameDraftType":0.0,"maxBots":3.0,"allowaimslowdown":false,"zmBotsMax":1.0,"useEmblemInsteadOfFactionIcon":false,"scorePerPlayer":false,"zmLimitedDownsAmount":0.0,"zmElixirInPlainsight":true,"vehiclesTimed":true,"allowFinalKillcam":false,"zmPointLossOnDeath":0.0,"spawnsuicidepenalty":0.0,"zmTalismanExtraMolotov":true,"zmPowerupSpecialWeapon":true,"pregamePreStageTime":0.0,"zmElixirNearDeathExperience":true,"maxPlayOfTheMatchEventTime":20.0,"killcamGrenadeTime":9.1841E-41,"ballCount":0.0,"zmCrawlerAggro":true,"characterCustomization":0.0,"playerForceRespawn":true,"zmElixirHeadScan":true,"scoreThiefPowerGainFactor":0.0,"zmPopcornHealthMult":1.0,"forceRadar":0.0,"gunSelection":0.0,"zmMiniBossHealthMult":1.0,"zmBarricadeState":true,"escalationEnabled":false,"teamScorePerHeadshot":0.0,"zmTalismanExtraFrag":true,"playOfTheMatchAllowSkip":true,"autoDestroyTime":0.0,"randomObjectiveLocations":0.0,"zmElixirArsenalAccelerator":true,"zmWeaponsMelee":true,"zmCatalystState":1.0,"zmPointLossOnDown":0.0,"hardcoreMode":false,"zmElixirCtrlZ":true,"trmMaxHeight":3.85186E-34,"zmPowerupChaosPoints":true,"zmElixirWallToWall":true,"servermsec":50.0,"plantTime":4.5918E-41,"throwScore":0.0,"voipEveryoneHearsEveryone":false,"zmPerksMuleKick":true,"zmElixirWhosKeepingScore":true,"zmTalismansLegendary":true,"draftEnabled":true,"oldschoolMode":false,"zmElixirDeadOfNuclearWinter":true,"spawnGroupRadius":450.0,"setbacks":0.0,"allowKillcam":false,"zmTalismanShieldDurabilityLegendary":true,"zmCatalystHealthMult":1.0,"zmMysteryBoxLimit":0.0,"playerObjectiveHeldRespawnDelay":4.5918E-41,"zmRandomWallBuys":0.0,"useSpawnGroups":false,"zmCraftingKeyline":false,"capturesPerReturnSite":0.0,"zmHealthStartingBars":3.0,"scoreEquipmentPowerTimeFactor":-0.5039253,"zmElixirBoardGames":true,"timeLimit":1.4E-44,"zmElixirStockOption":true,"zmWeaponsLMG":true,"zmShowTimer":false,"idleFlagResetTime":0.0,"zmPowerupsIsLimitedRound":false,"zmTalismanBoxGuaranteeWonder":true,"zmPerkDecay":1.0,"pregamePositionShuffleMethod":0.0,"allowInGameTeamChange":false,"zmElixirSodaFountain":true,"disableContracts":false,"maxAllowedSkills":0.0,"pointsForSurvivalBonus":0.0,"spawnprotectiontime":0.0,"zmMysteryBoxLimitRound":0.0,"flagRespawnTime":0.0,"ticketsLostOnTimeInterval":0.0,"teamScorePerCleanDeposit":0.0,"zmPerksSpeed":true,"scoreHeroPowerGainFactor":1.4E-45,"rebootPlayers":false,"extraTime":1.17549435E-38,"zmElixirNowhereButThere":true,"totalKillsMax":0.0,"zmPowerupNuke":true,"headshotsonly":false,"zmElixirBloodDebt":true,"zmTalismanExtraClaymore":true,"bonusLivesForCapturingZone":0.0,"zmElixirsEpic":true,"zmPowerupMaxAmmo":true,"loadoutKillstreaksEnabled":true,"pregamePostRoundTime":0.0,"teamScorePerKill":0.0,"disableManualHealing":false,"zmPowerupFrequency":1.0,"zmWonderWeaponIsEnabled":true,"zmWeaponsAR":true,"ekiaClearTime":0.0,"kothMode":false,"disableAttachments":false,"pointsPerSecondaryKill":0.0,"zmPerksDeadshot":true,"voipKillersHearVictim":true,"zmTalismansUltra":true,"zmPowerupDouble":true,"disableClassSelection":false,"zmPowerState":1.0,"zmPerksActive":true,"zmElixirAlwaysDoneSwiftly":true,"zmHeavyAggro":true,"playerHealthRegenTime":9.7E-44,"bulletDamageScalar":1.4E-45,"zmTalismanReducePAPCost":true,"prematchperiod":0.0,"spawntraptriggertime":4.5918E-41,"objectiveSpawnTime":0.0,"droppedTagRespawn":false,"playerMaxHealth":100.0,"zmWeaponsShotgun":true,"zmMiniBossState":1.0,"zmElixirNowYouSeeMe":true,"forwardSpawnDefaultBuildTime":0.0,"captureTime":1.4E-44,"lowImpactBots":false,"fowRevealEnabled":false,"zmElixirPerkaholic":true,"scoreHeroPowerTimeFactor":5.877875E-39,"maxPlayerEventsPerMinute":0.0,"zmSelfReviveAmount":0.0,"perksEnabled":false,"depositTime":0.0,"maxPlayOfTheMatchTotalTime":60.0,"weaponTimer":0.0,"zmPowerupsLimitRound":0.0,"zmShieldIsEnabled":true,"pregamePostStageTime":0.0,"forwardSpawnEnabled":false,"zmCrawlerDamageMult":1.0,"zmEquipmentChargeRate":1.0,"teamScorePerKillConfirmed":0.0,"usableDynents":false,"zmMysteryBoxState":2.0,"prematchrequirement":0.0,"zmHealthDrain":0.0,"zmTalismansRare":true,"zmZombieMinSpeed":0.0,"deployableBarrierDestroyTime":0.0,"movePlayers":false,"deathZones":false,"crateCaptureTime":2.3322E-41,"deployableBarrierBuildTime":0.0,"playOfTheMatchAllowCinematicCameras":true,"pregameScorestreakModifyTime":0.0,"zmZombieSpread":1.0,"inactivityKick":0.0,"zmTalismanStartWeaponSMG":true,"flagCaptureCondition":false,"voipDeadChatWithTeam":true,"zmPointLossOnTeammateDeath":0.0,"zmElixirEquipMint":true,"zmCatalystSpawnFreq":1.0,"zmTalismansIndividual":true,"zmPointsStarting":5.0,"cleanDepositOnlineTime":0.0,"pointsPerWeaponKill":0.0,"gameAdvertisementRuleTimeLeft":0.0,"hideEnemiesExceptSensorDart":false,"robotSpeed":0.0,"zmElixirsDurables":true,"classicMode":false,"zmMysteryBoxIsLimitedRound":false,"maxActiveKillcams":0.0,"maxPlayerDefensive":0.0,"friendlyfiretype":0.0,"vehiclesEnabled":true,"zmTalismanSpecialXPRate":true,"forwardSpawnProximityActivate":false,"zmCrawlerHealthMult":1.0,"zmHeavyState":1.0,"draftSwitchCooldown":0.0,"forwardSpawnTeamSpecificSpawns":false,"forwardSpawnProximityRadius":0.0,"pregameDraftEnabled":false,"zmTalismanPerkPermanent4":true,"zmTalismanShieldPrice":true,"zmTalismanPerkPermanent2":true,"zmTalismanPerkPermanent3":true,"zmPowerupFreePerk":true,"zmTalismanPerkPermanent1":true,"playerQueuedRespawn":false,"zmElixirAftertaste":true,"zmElixirDangerClosest":true,"maxPlayers":4.0,"voipDeadChatWithDead":false,"bootTime":0.0,"pointsPerMeleeKill":0.0,"zmPerksQuickRevive":true,"zmElixirExtraCredit":true,"voipLobbyChatPartyOnly":false,"zmMinibossSpawnFreq":1.0,"zmCrawlerState":1.0,"autoTeamBalance":false,"bombTimer":-1.1920929E-7,"teamKillSpawnDelay":20.0,"zmPerksWidowsWail":true,"cleanDepositRotation":0.0,"zmElixirNewtonianNegation":true,"voipDeadHearKiller":false,"boastAllowCam":false,"zmWeaponsSMG":true,"pregameDraftRoundTime":0.0,"zmHealthRegenRate":2.0,"teamCount":1.0,"killcamHistorySeconds":60.0,"hotPotato":false,"zmPowerupsActive":true,"maxSuicidesBeforeKick":0.0,"zmTalismansEnabled":true,"zmEquipmentIsEnabled":true,"spawnHealthBoostPercent":0.0,"zmHeavyDamageMult":1.0,"zmPerksJuggernaut":true,"onlyHeadshots":false,"teamScorePerDeath":0.0,"boastEnabled":false,"zmElixirCacheBack":true,"draftRequiredClients":0.0,"ticketsLostOnDeath":0.0,"playOfTheMatchBlacklistGraceRate":0.0,"zmPerksBandolier":true,"forwardSpawnFastUseMultiplier":0.0,"heliUseNavvolumePaths":false,"killEventScoreMultiplier":4.59177E-40,"weaponCount":0.0,"zmTimeCap":0.0,"teamNumLives":0.0,"disableThirdPersonSpectating":false,"zmTalismanImpatient":true,"zmWeaponsPistol":true,"multiBomb":false,"playerNumLives":0.0,"magic":true,"zmMainQuestIsEnabled":true,"disableCompass":false,"pregamePositionSortType":0.0,"ticketsGivenAtStageStart2":0.0,"spectateType":1.0,"ticketsGivenAtStageStart1":0.0,"zmElixirUndeadManWalking":true,"ticketsGivenAtStageStart4":0.0,"zmPerksAllRandom":false,"ticketsGivenAtStageStart3":0.0,"ticketsGivenAtStageStart0":0.0,"allowprone":false,"enableArmorFeedback":false,"zmPopcornSpawnFreq":1.0,"objectiveHealth":0.0,"gameAdvertisementRuleScorePercent":0.0,"zmPerksElectricBurst":true,"zmMysteryBoxIsLimitedMove":false,"zmDoorState":1.0,"zmElixirAlchemicalAntithesis":true,"playOfTheMatchBufferSize":1.4E-44,"deployableBarrierHealth":0.0,"spawnteamkilledpenalty":0.0,"pregameAlwaysShowStreakEdit":false,"zmPointsLossPercent":0.0,"allowdogs":false,"pregameAlwaysShowCACEdit":false,"disableTacInsert":false,"rebootTime":0.0,"zmStartingWeaponEnabled":true,"zmPerksCooldown":true,"deployableBarriersEnabled":false,"zmTalismanPerkReduceCost4":true,"voipDeadHearTeamLiving":true,"zmPaPEnabled":1.0,"zmTalismanPerkReduceCost3":true,"deployableBarrierRechargeTime":0.0,"zmTalismanPerkReduceCost2":true,"zmPowerupInstakill":true,"zmTalismanPerkReduceCost1":true,"zmElixirsCommon":true,"allowhitmarkers":2.0,"startRound":1.0,"maxObjectiveEventsPerMinute":1.14794E-41,"pointsPerPrimaryGrenadeKill":0.0,"enemyCarrierVisible":0.0,"roundWinLimit":0.0,"allowPlayOfTheMatch":false,"specialistChangeCooldownTime":0.0,"zmMiniBossAggro":true,"defuseTime":5.878189E-39,"zmPointsLossOnHit":false,"spawnSelectEnabled":false,"zmElixirBurnedOut":true,"maxAllowedSecondaryAttachments":0.0,"zmRetainWeapons":true,"allowCinematicSpectate":false,"zmPerksDeathPerception":true,"zmTalismanExtraMiniturret":true,"zmPerksDyingWish":true,"zmElixirKillJoy":true,"playOfTheMatchAllowBotBookmarks":true,"playOfTheMatchIgnoreKillBookmark":false},"teamScore":3210,"alliesScore":0,"utcStartTimeSeconds":1538439232,"utcEndTimeSeconds":1538439549,"matchID":"2274762526967524868","isPrivateMatch":"false","playerCount":1});
    }

})(COD, jQuery);

var COD = COD || {};
var ATVI = ATVI || {};

(function(COD, ATVI, $) {
    COD.api = COD.api || {};
    COD.api.sso = COD.api.sso || {};

    COD.api.sso.url = 'https://profile.callofduty.com/';

    var hashId;
    COD.api.sso.hashId = function() {
        var id = hashId = hashId || ATVI.utils.getCookie("ACT_SSO_COOKIE");
        return id;
    };

    COD.api.sso.unoId = function() {
        var hashId = COD.api.sso.hashId();
        return ATVI.utils.decodeBase64(hashId).split(':')[0];
    };

    COD.api.sso.error = function(endpoint, error) {
        return 'API error: ' + error + ' (' + endpoint + ').';
    };

    COD.api.sso.get = function(endpoint, callback, error) {
        var url = COD.api.sso.url + endpoint;
        return COD.api.get(url, callback, error);
    };

    COD.api.sso.post = function(endpoint, data, callback, error) {
    	var csrfUrl = COD.api.sso.url + "cod/csrf";
    	$.get(csrfUrl)
    		.success(function() {
	    		var token = ATVI.utils.getCookie("XSRF-TOKEN", true);
	    		var url = COD.api.sso.url + endpoint;
	    		url += (url.indexOf("?") >= 0) ? "&" : "?";
	    		url += "_csrf=" + token;
	    		COD.api.post(url, data, callback, error);
    		})
    		.error(error);
    };

    COD.api.sso.delete = function(endpoint, callback, error) {
        var csrfUrl = COD.api.sso.url + "cod/csrf";
        $.get(csrfUrl)
            .success(function() {
                var token = ATVI.utils.getCookie("XSRF-TOKEN", true);
                var url = COD.api.sso.url + endpoint;
                url += (url.indexOf("?") >= 0) ? "&" : "?";
                url += "_csrf=" + token;
                COD.api.delete(url, callback, error);
            })
            .error(error);
    };

    COD.api.sso.getEmblems = function(game, platform, gamerId, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        if (!game || !platform) {
            return error(COD.api.sso.error(endpoint, 'invalid parameters.'));
        }

        var endpoint;
        if(!gamerId) {
	        var unoId = COD.api.sso.unoId();
	        endpoint = ['cod', 'emblems', game, platform, 'uno', unoId].join('/');
        } else {
        	endpoint = ['cod', 'emblems', game, platform, 'gamer', gamerId].join('/');
        }
        var queryParams = {
            cache: Date.now()
        };
        endpoint = COD.api.editQueryString(endpoint, queryParams);

        COD.api.sso.get(endpoint, function(res) {
            res = res || {};
            var data = res.data || {};
            if (res.status !== 'success') return error(res.errors || res.status);
            return callback(data);
        }, error);
    };


    COD.api.sso.saveEmblem = function(emblem, game, platform, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        var unoId = COD.api.sso.unoId();
        var endpoint = ['cod', 'emblems', game, platform, 'uno', unoId].join('/');
        if (!game || !platform || !unoId) {
            return error(COD.api.sso.error(endpoint, 'invalid parameters.'));
        }

        COD.api.sso.post(endpoint, emblem, function(res) {
            res = res || {};
            var data = res.data || {};
            if (res.status !== 'success') return error(data.message || res.status);
            return callback(data);
        }, error);
    };

    COD.api.sso.deleteEmblem = function(emblemId, game, platform, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        var unoId = COD.api.sso.unoId();
        var endpoint = ['cod', 'emblems', game, platform, 'uno', unoId, 'delete', emblemId].join('/');
        if (!game || !platform || !unoId || !emblemId) {
            return error(COD.api.sso.error(endpoint, 'invalid parameters.'));
        }

        COD.api.sso.delete(endpoint, function(res) {
            res = res || {};
            var data = res.data || {};
            if (res.status !== 'success') return error(data.message || res.status);
            return callback(data);
        }, error);
    };

    COD.api.sso.shareEmblem = function(emblem, game, platform, callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        var unoId = COD.api.sso.unoId();
        var endpoint = ['cod', 'emblems', game, platform, 'uno', unoId, 'share'].join('/');
        if (!game || !platform || !unoId || !emblem) {
            return error(COD.api.sso.error(endpoint, 'invalid parameters (shareEmblem).'));
        }

        COD.api.sso.post(endpoint, emblem, function(res) {
            res = res || {};
            var data = res.data || {};
            if (res.status !== 'success') return error(data.message || res.status);
            return callback(data);
        }, error);
    };

    COD.api.sso.checkFreeSupplyDrops = function(callback, error) {
        callback = typeof callback === 'function' ? callback : function(data) {};
        error = typeof error === 'function' ? error : function(err) {};

        var endpoint = COD.api.sso.url + "promotions/redeem/cod/mycod";
        if(COD.api.dev) {
            var endpoint = "https://uat.callofduty.com/promotions/redeem/cod/mycod";
        }

        $.get(endpoint).success(function(res) {
            if (res && res.indexOf('success-subtitle') >= 0){
                callback(true);
            } else if(res.indexOf('entryLimit') >= 0){
                callback(false);
            } else {
                error('failed to get free drop status');
            }
        }).fail(error);

    };

    COD.api.sso.fetchFeed = function (callback, error) {
        var endpoint = `https://www.callofduty.com/site/cod/franchiseFeed/${ATVI.pageLocale.toLocaleLowerCase()}?source=web`;

        if(COD.api.dev || COD.api.stage) {
            endpoint = `/site/cod/franchiseFeed/${ATVI.pageLocale.toLocaleLowerCase()}?source=web`;
        }

        COD.api.get(endpoint, callback, error);
    };

    COD.api.sso.fetchDictionary = function (callback, error) {
        var endpoint = `/content/atvi/callofduty/mycod/web/${ATVI.pageLocale.toLocaleLowerCase()}/data/json/iq-content-xapp.js`;
        COD.api.get(endpoint, callback, error);
    };


})(COD, ATVI, jQuery);


// COD Fonts

(function() {

    WebFontConfig = {
        google: { families: [ 'Arvo:400,700', 'Electrolize::latin', 'Open+Sans+Condensed:300,700:latin', 'Open+Sans:400:latin' ] }
    };

    (function() {
        var wf = document.createElement('script');
        wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0]; 
        s.parentNode.insertBefore(wf, s);
    })();
})();


// COD GLOBAL NAV
// NOTE: Lithium nav located at: /etc/designs/atvi/lithium-v2/call-of-duty/common/js/global-nav.js

var COD = COD || {}; 

(function($, COD) {

    COD.menu = COD.menu || {};
    menu = COD.menu;
    var $megamenu, $topNavLinks, $subLinks, $curTopLink;
    var isMouseOverMenu = false;
    var overMainNav = false;
    var menuActive = false;
    var curMenuState;
    var gameMode;

    var breakpoint = 1040;

	var init = function() {
		$(postload);
	};

	var postload = function() {
		defineElements();
        determineMode();
		setupHamburger();
        setupPPMenu();
		setupMegaMenu();
        setupNewsMenu();
        setupEsportsMenu();
        setupMobileMenu();
		setupLocaleSelector();
		setupSsoLinks();
		resize();
	}; 

    var defineElements = function() {
        $megamenu = $(".main-mega-menu");
        $topNavLinks = $(".global-main-menu li.submenu-parent");
        $subLinks = $megamenu.find(".sub-links-list");
    };

    var determineMode = function() {
		if($(".top-game-menu").length) gameMode = true;
        else gameMode = false;
    }

    var setupPPMenu = function() {

        $(document).click(function(){
          	$(".player-profile-menu").removeClass("active");
        });

		//Open pp menu
        var $ppopen = $(".menu-profile-name-container");
        $ppopen.click(function(e) {
			$(".player-profile-menu").toggleClass("active");
            $(".global-nav-container .support-menu").removeClass("active");
            e.stopPropagation();
        });

        //Close pp menu
        var $close = $(".pp-header .pp-close");
        $close.click(function() {
			$(".player-profile-menu").removeClass("active");
        });

        $(".player-profile-menu").click(function(e){
          	e.stopPropagation();
        });

    }

    var setupMegaMenu = function() {

        //On load, set active to first sub link in each section
        $subLinks.find("li:first-of-type").addClass("active");

        //Add mouseover handler
        $topNavLinks.on("touchstart mouseover", function() {
            overMainNav = true;

            $topNavLinks.removeClass("active");
            $(this).addClass("active");

            $curTopLink = $(this);

            var className = $(this).attr("class").split(/\s+/)[0];
            curMenuState = className;
            menuMouseOver(curMenuState);

        }).on("touchleave mouseout", function() {

            setTimeout(function() {
                if(overMainNav) {
                    $megamenu.find(".menu-section .menu-section-inner").removeClass("active");
                }
            }, 300);

            menuMouseOut();

        });

        $megamenu.on("touchstart mouseover", function() {
            overMainNav = false;
            menuMouseOver(curMenuState);
        }).on("touchleave mouseout", function() {
            menuMouseOut();
        }); 

        //Clicking on sublinks
        $subLinks.find("li:not(.fan-content) a").click(function(e) {

            //If you clicked on a non-active sub link
            if(!$(this).closest("li").hasClass("active")) {
                e.preventDefault();
            }

            if($(this).closest("li").hasClass("active") && ($(this).closest(".menu-section.games-menu-section").length || $(this).closest(".menu-section.community-menu-section").length || $(this).closest(".menu-section.purchase-menu-section").length)) {
                e.preventDefault();
            } 

            //Remove active class from all sub links in that menu section and apply to selected sub link
            $(this).closest("ul").find("li").removeClass("active");
            $(this).closest("li").addClass("active");

            //Get identifier class name of selected link, it'll always be the first class
            var $parentContainer = $(this).closest(".menu-section");
            var selectedSubLink = $(this).closest("li").attr("class").split(" ")[0];

            //Hide all content viewers
            $parentContainer.find(".sub-links-content-viewer > div").hide();

            //Show content of selected link
            $("." + selectedSubLink + "-menu-content").show();

        });


        //Social icon popup
        $(".social-channels-content .social-entry a").click(function(e) {

            var $overlay = $(this).closest(".social-entry").find(".social-overlay");

            if($overlay.length) {

                e.preventDefault();
                $overlay.fadeIn();

            }

        });

        socialClickHandlers();


    };

    var socialClickHandlers = function() {

        var $socialClose = $(".social-entry .close");
        var $overlay = $(".social-entry .social-overlay");

        $socialClose.add($overlay).click(function() {
            $overlay.fadeOut();
        });

    };

    var menuMouseOver = function(className) {

        if(window.innerWidth > breakpoint) {

            if(!isMouseOverMenu) {
    
                isMouseOverMenu = true;
                
                setTimeout(function() {
                    
                    if(!$curTopLink.hasClass("drop")) $megamenu.addClass("active");
                    else $megamenu.removeClass("active");

                    $megamenu.find(".menu-section").removeClass("active");
                    var $subMenu = $megamenu.find("." + className + "-menu-section");
                    $subMenu.addClass("active");

                    setTimeout(function() {
                        if(!$curTopLink.hasClass("drop")) {

                            $subMenu.find(".menu-section-inner").addClass("active");
                        }
                    }, 10);

                }, 300);
                
            }

        }

    };

    var menuMouseOut = function() {

        if(window.innerWidth > breakpoint) {

            isMouseOverMenu = false;
            var delay;

            if($curTopLink.hasClass("drop")) delay = 0;
            else delay = 300;

            setTimeout(function(){
                
                if(!isMouseOverMenu){
                    $megamenu.removeClass("active");
                    $topNavLinks.removeClass("active");
                    $megamenu.find(".menu-section").removeClass("active");
                    $megamenu.find(".menu-section .menu-section-inner").removeClass("active");
                    overMainNav = false;
                }
                
            }, delay);

        }

    };

    var setupHamburger = function() { 
        if(gameMode) return;
        $(".mobile-menu-icon").on("click", openMenu);
        $(".mobile-nav-close").on("click", closeMenu);
    };

    var openMenu = function(e) {
        if(e) e.preventDefault();
        $("body").addClass("menu-open");
    };

    var closeMenu = function(e) {
        $("body").removeClass("menu-open");
    };

    var setupMobileMenu = function() {

        //var $mobileNavContainer = $(".global-mobile-nav-container");
        var $mobileNavContainer = $(".primary-nav");
        var $topLink = $mobileNavContainer.find(".submenu-parent > p > a");

        $topLink.click(function(e) {

            e.preventDefault();

            var $parent = $(this).closest(".submenu-parent");
            if($parent.hasClass("active")) $parent.removeClass("active");
            else $parent.addClass("active");

            $topLink.not($(this)).closest(".submenu-parent").removeClass("active");

        });

        var $subLink = $mobileNavContainer.find(".submenu-parent .submenu > li.nav-item:not(.fan-content):not(.buy-game1):not(.buy-game2):not(.buy-game3) > p > a");

        $subLink.click(function(e) {

            var eve = e;

            var $parent = $(this).closest(".nav-item");

            if(!$parent.closest(".submenu-parent").hasClass("no-sub")) {
                eve.preventDefault();
            }

            if($parent.hasClass("active")) $parent.removeClass("active");
            else $parent.addClass("active");

            $subLink.not($(this)).closest(".nav-item").removeClass("active");

        });

        //Default newest games
        $(".global-mobile-nav li.games > p > a").click();
        $(".global-mobile-nav li.newest-releases > p > a").click();


    };

    var setupSsoLinks = function() {
        var sb = window.ssobar;
        if(sb) sb.onAuthentication(function() {
            sb.onReady(updateAccountLinksFromSso);
            $(".global-nav .global-sso-menu > ul li.sso-link").addClass("ready");
        });

    };

    var updateAccountLinksFromSso = function() {
        var sso = $(".SSO-BAR");
        var $body = $("body");

        try {
            if(window.ssobar.user.isLoggedIn) {
                $body.addClass("sso-logged-in");
                //var game = menu.game || getCurGame();
                //menu.initPlayerProfile();
            }
        } catch(e) {}
        setTimeout(function() {
            $body.addClass("sso-auth-known"); 
        }, 20);

        $(".global-nav-right a.login-link").attr("href", sso.find("#login-solo").attr("href"));
        $(".global-nav-right a.signup-link").attr("href", sso.find("#signup-solo").attr("href"));
        $(".global-nav-right a.profile-link").attr("href", sso.find("#sso-account-action-profile").attr("href"));
        $(".global-nav-right a.logout-link").attr("href", sso.find("#sso-account-action-logout").attr("href"));
        $(".player-profile-menu .pp-links li.ppl-signout a").attr("href", sso.find("#sso-account-action-logout").attr("href"));
        $(".menu-support-container .s-login-btn a").attr("href", sso.find("#login-solo").attr("href"));

        $(".primary-nav a.login-link").attr("href", sso.find("#login-solo").attr("href"));
        $(".primary-nav a.signup-link").attr("href", sso.find("#signup-solo").attr("href"));
        $(".primary-nav a.profile-link").attr("href", sso.find("#sso-account-action-profile").attr("href"));
        $(".primary-nav a.logout-link").attr("href", sso.find("#sso-account-action-logout").attr("href"));

    };

    var localeMap = {
        en: "en_US",
        pt: "pt_BR",
        mx: "es_MX"
    };

    var setupLocaleSelector = function() {
        if(!ATVI.components.localeSelector) return;
        ATVI.components.localeSelector.onLinkClick = function(context, $link, locale) {
            if(localeMap[locale]) locale = localeMap[locale];
            else if(locale.length == 2) locale = locale + "_" + locale;
            var m = locale.match(/^(\w\w)_(\w\w)$/);
            if(m) {
                locale = m[1] + "_" + m[2].toUpperCase();
                ATVI.utils.setCookie("ACT_SSO_LOCALE", locale, {
                    domain: ".callofduty.com"
                });
            }
        };

        // add v2 locale selector to SSO bar
        ssobar.onReady(function() {
            var ssoLocale = $('#menu-locale'),
                v2Locale = $('.site-nav .locale-selector-li.to-sso');
            if(v2Locale.length) ssoLocale.replaceWith(v2Locale);
        });

        // remove esrb privacy from non US sites
        if($(".atvi-instrument-locale-menu-button.US").length <= 0 && $(".atvi-instrument-locale-menu-button.MX").length <= 0 && $(".atvi-instrument-locale-menu-button.CA").length <= 0) {
            $(".footer-content-container .esrb-pc").hide(); 
        }

        // remove rating from zh sites
        /*if($(".atvi-instrument-locale-menu-button.TW").length >= 1 || $(".atvi-instrument-locale-menu-button.CN").length >= 1) {
            $(".footer-content-container a.ratings-logo").hide(); 
        }*/
    };
	
    var resize = function() {

        $(window).resize(function() {

            if(window.innerWidth > 1100) {
                closeMenu();
            }

        });

    };

    var setupNewsMenu = function() {
        var setUpBlogInfo = function(data, location){
            for(i=0; i<4; i++){
                var currBlog = data[i];
                var currBlogTitle = currBlog.title;
                var currBlogImg = currBlog.images[0].src;
                var currBlogUrl = currBlog.url;
                var newsArt = '<div class="news-art"><a href="'+currBlogUrl+'"><img src="'+currBlogImg+'" alt="'+currBlogTitle+'"></a></div>';
                var newsTitle='<div class="news-title"><p><a href="'+currBlogUrl+'">'+currBlogTitle+'</a></p></div>';
                var newsEntry = '<div class="news-entry">'+newsArt+newsTitle+'</div>';
                $(location).append(newsEntry); 

                if(i==0) {
                    //initAlertNews (data[0].id, location);
                }
            }
        }

        var currLocale=ATVI.utils.parseLocalizedPath(location.pathname).language;
		//var currLocale=ATVI.utils.parseLocalizedPath(location.pathname).locale;
        if(currLocale == "zh") currLocale = ATVI.utils.parseLocalizedPath(location.pathname).locale;
        if(currLocale == "br") currLocale = ATVI.utils.parseLocalizedPath(location.pathname).region;
        if(currLocale == "xp") currLocale = "en"; 
        $( "div.cod-blog-feed-container").append('<div class="cod-blog-content news-content"></div>');
        JSONFeedUrl="/content/atvi/callofduty/hub/web/"+currLocale+"/data/json/cod-blog-lithium.js";
        $.getJSON(JSONFeedUrl, function(data) {
            setUpBlogInfo(data,"div.cod-blog-content");
        });

        $( "div.atvi-blog-feed-container").append('<div class="atvi-blog-content news-content"></div>');
        $.getJSON( "/content/atvi/callofduty/hub/web/en/data/json/atvi-blog-lithium.js", function(data) {
            setUpBlogInfo(data,"div.atvi-blog-content");
        });
    };

    var setupEsportsMenu = function() {
        var setUpEsportsVideo = function(data, location){
            for(i=0; i<4; i++){ 
                var currVideoTitle = data.data.data.objects[i].title;
                var currVideoImg = data.data.data.objects[i].image;
                var currVideoUrl = "https://www.callofduty.com"+data.data.data.objects[i].link;
                var esportsArt = '<div class="esports-art" style="background:url(' + currVideoImg + ') center center no-repeat; background-size: cover;"><a href="'+currVideoUrl+'"></a></div>';
                //<img src="'+currVideoImg+'" class="esports-video-img" alt="'+currVideoTitle+'">
                var esportsTitle='<div class="esports-title"><p><a href="'+currVideoUrl+'">'+currVideoTitle+'</a></p></div>';
                var esportsEntry = '<div class="esports-entry">'+esportsArt+esportsTitle+'</div>';
                $(location).append(esportsEntry); 
            }
        }
        var setUpEsportsNews = function(data, location){
            for(i=0; i<4; i++){
                var currNewsTitle = data.data[i].title;
                var currNewsImg = data.data[i].image;
                var currNewsUrl = "https://www.callofduty.com"+data.data[i].link;
                //var esportsArt = '<div class="esports-art"><a href="'+currNewsUrl+'"><img src="'+currNewsImg+'" alt="'+currNewsTitle+'"></a></div>';
                var esportsArt = '<div class="esports-art" style="background:url(' + currNewsImg + ') center center no-repeat; background-size: cover;"><a href="'+currNewsUrl+'"></a></div>';
                var esportsTitle='<div class="esports-title"><p><a href="'+currNewsUrl+'">'+currNewsTitle+'</a></p></div>';
                var esportsEntry = '<div class="esports-entry">'+esportsArt+esportsTitle+'</div>';
                $(location).append(esportsEntry); 
            }
        }
        $( "div.esports-video-feed-container").append('<div class="esports-video-content esports-content"></div>');
        $.getJSON( "https://www.callofduty.com/esports/data/v1/content/videos/latest/0/6?domain=" + window.location.hostname, function(data) {
            setUpEsportsVideo(data,"div.esports-video-content");
        });

        $( "div.esports-news-feed-container").append('<div class="esports-news-content esports-content"></div>');
        $.getJSON( "https://www.callofduty.com/esports/data/v1/content/trendingArticles?domain=" + window.location.hostname, function(data) {
            setUpEsportsNews(data,"div.esports-news-content");
        });

        //Write code here to get json data from esports site, 
        //create template, 
        //inject into $(“.esports-news-feed-container”), $(“.esports-schedule-feed-container”), $(“.esports-standings-feed-container”), $(“.esports-video-feed-container”)

        $.getJSON("https://www.callofduty.com/esports/data/v1/schedule/global/current?domain=" + window.location.hostname, function(dataSched) {
            var teamMap = dataSched.data.data.teamMap;
            var timeDict = dataSched.data.dictionary;
            var matchArr = dataSched.data.data.matches;
            matchArr.sort(function(a, b){return a.startDate-b.startDate});
            var counter = 0;
            var numMatchtoDisplay = 4;
            var currMatchArr = [];
            var actDate = new Date();
            var j = 0;
            var tempCurrDate = new Date(matchArr[j].startDate);
            //for(i=0; i<matchArr.length; i++){
            for(i=0; i<5; i++){
                if(tempCurrDate.getMonth()<actDate.getMonth() || tempCurrDate.getDate()<actDate.getDate()){
                    j++;
                    tempCurrDate = new Date(matchArr[j].startDate);
                }
            }
            var setDate = new Date(matchArr[j].startDate);
            console.log(setDate);
            for(i=j; i<matchArr.length; i++){
                var currDate = new Date(matchArr[i].startDate);
                if(currDate.getDate() == setDate.getDate() && currDate.getMonth() == setDate.getMonth() && counter<numMatchtoDisplay){
                    currMatchArr.push(matchArr[i]);
                    counter++;
                }
            }
            var matchMonthNum = setDate.getMonth()+1;
            var monthStr = "date.month-"+matchMonthNum+".short";
            var matchMonth = timeDict[monthStr];
            var matchDateVal = setDate.getDate();
            var matchDayNum = setDate.getDay();
            if(matchDayNum==0)matchDayNum = matchDayNum + 7;
            var dayStr = "date.day-"+matchDayNum+".short";
            var matchDay = timeDict[dayStr];

            var dateStrTemplate =   '<h3 class = "date">'
                                +       '<span class = "month">'+matchMonth+'</span>'
                                +       '<span class = "date-number">'+matchDateVal+'</span>'
                                +       '<span class = "Day">'+matchDay+'</span>'

            $(".esports-schedule-feed-container").append(dateStrTemplate); 
            console.log(dateStrTemplate);
            for(i=0; i<currMatchArr.length; i++){
                var codSched = currMatchArr[i];
                var matchDate = new Date(codSched.startDate);
                var matchHoursNum = matchDate.getHours();
                var matchMinNum = matchDate.getMinutes();
                var matchTime = convertTime(matchHoursNum, matchMinNum);
                var matchOpp1Id = codSched.opponent1;
                var matchOpp2Id = codSched.opponent2;


                var matchOpp1 = teamMap[matchOpp1Id].teamProfile.shortName;
                var matchOpp2 = teamMap[matchOpp2Id].teamProfile.shortName;
                var matchOpp1Logo = "https://www.callofduty.com"+teamMap[matchOpp1Id].teamProfile.logoImageSmall;
                var matchOpp2Logo = "https://www.callofduty.com"+teamMap[matchOpp2Id].teamProfile.logoImageSmall;
                var matchOpp1Link = "https://www.callofduty.com"+teamMap[matchOpp1Id].link;
                var matchOpp2Link = "https://www.callofduty.com"+teamMap[matchOpp2Id].link;
                var matchOpp1Score = codSched.team1Score;
                var matchOpp2Score = codSched.team2Score;
                var matchState = codSched.matchState;
                var matchLink ="https://www.callofduty.com"+codSched.link;

                var quote = "'";               

                var matchHTML ='<div class="esports-entry">'
                               +'<div class="match match-'+i+' '+matchState+'">'
                               +'   <div class="time time-final">Final</div>'
                               +'   <div class="time">'+matchTime+'</div>'
                               +'   <div class="team team-number-1 team-id-'+matchOpp1Id+'">'
                               +'       <a href="'+matchOpp1Link+'">'
                               +'            <p class="team-logo team-number-1 small-logo" style="background-image: url('+quote+matchOpp1Logo+quote+')"></p>'
                               +'       </a>'     
                               +'       <div class="team-name">'   
                               +'           <p class="abbreviated">'+matchOpp1+'</p>'     
                               +'       </div>'
                               +'       <div class="score">'+matchOpp1Score+'</div>'
                               +'   </div>'
                               +'   <div class="team team-number-2 team-id-'+matchOpp2Id+'">'
                               +'       <a href="'+matchOpp2Link+'">'       
                               +'           <p class="team-logo team-number-2 small-logo" style="background-image: url('+quote+matchOpp2Logo+quote+')"></p>'
                               +'       </a>'     
                               +'       <div class="team-name">'
                               +'           <p class="abbreviated">'+matchOpp2+'</p>'     
                               +'       </div>'
                               +'       <div class="score">'+matchOpp2Score+'</div>'
                               +'  </div>'

                if(matchState=="in-progress"){
                    var inProgContainer = '    <a href="'+matchLink+'" class="match-link">Watch Live</a></div></div>'
                    matchHTML = matchHTML + inProgContainer;
                    $(".esports-schedule-feed-container").append(matchHTML);
                }else{
                    var inProgContainer = '    <a href="'+matchLink+'" class="match-link">Watch</a></div></div>'
                    matchHTML = matchHTML + inProgContainer;
                    $(".esports-schedule-feed-container").append(matchHTML);
                }
            }
        });

        var convertTime = function(hours, minutes){
            if(minutes<10)minutes="0"+minutes;
            if(hours>12)return hours-12+":"+minutes+"PM PDT";
            else if(hours == 0) return 12+":"+minutes+"AM PDT";
            else return hours+":"+minutes+"AM PDT";
        }

        $.getJSON("https://www.callofduty.com/esports/data/v1/standings/na/season/2016_stage_two/data?domain=" + window.location.hostname, function(dataStandings) {
            var teamMap = dataStandings.data.data.teamMap;
            standArr=dataStandings.data.data.standings;
            for(i=0; i<4; i++){
                var teamID = standArr[i].teamId;
                var teamName = teamMap[teamID].teamProfile.displayName;
                var teamLogo = "https://www.callofduty.com"+teamMap[teamID].teamProfile.logoImage;
                var teamLink = "https://www.callofduty.com"+teamMap[teamID].link;
                var standing = i+1+". ";

                var standingHTML= '<div class="esports-entry">'
                                 +'   <div class="esports-art-logo">'
                                 +'     <a href="'+teamLink+'">'
                                 +'       <img src="'+teamLogo+'" alt="'+teamName+'">'
                                 +'     </a>'
                                 +'   </div>'
                                 +'   <div class="esports-team">'
                                 +'     <p><a href="'+teamLink+'">'+standing+teamName+'</a></p>'
                                 +'   </div>'
                                 +'</div>'
                $(".esports-standings-feed-container").append(standingHTML);
            }
        });

    };

    var setupNavTracking = function() {

        //news
        $(".news-menu-section .sub-links-list a").addClass("atvitt35nav");
        $(".global-main-menu li.news.nav-link.submenu-parent ul a").addClass("atvitt35nav");
        $(".news-menu-section .sub-links-content-viewer a").addClass("atvitt35subnav");

        //esports
        $(".esports-menu-section .sub-links-list a").addClass("atvitt35nav");
        $(".global-main-menu li.esports.nav-link.submenu-parent ul a").addClass("atvitt35nav");
        $(".esports-menu-section .sub-links-content-viewer a").addClass("atvitt35subnav");

    };

	init();

})(jQuery, COD);

// COD GLOBAL PLAYER PROFILE

var COD = COD || {}; 

(function($, COD) {

    menu = COD.menu;

    var init = function() {
		ssoReady();
    };

    var ssoReady = function() {
        var sb = window.ssobar;
        if(sb) sb.onAuthentication(function() {
            sb.onReady(checkLoginState);
        });

    };

    var checkLoginState = function() {
        var sso = $(".SSO-BAR");
        var $body = $("body");

        try {
            if(window.ssobar.user.isLoggedIn) {
                var game = menu.game || getCurGame();
                menu.initPlayerProfile();
                setupMyCodLink();
            }
        } catch(e) {}

    };

	menu.initPlayerProfile = function() { 

        var defaultUsername;
        menu.platformsAvailable = [];
		
		defaultIdentities = ssobar.user.identities;
		
		var crmBlobCookie = ATVI.utils.getCookie("CRM_BLOB");
        if(crmBlobCookie) {
        	var decoded = atob(crmBlobCookie);
          	var crmBlob = JSON.parse(decoded);
			menu.crmBlob = crmBlob.plat;
        }
		
		if(!menu.crmBlob || menu.game == "cod") { //if we loaded a page not wwii/iw/bo3, show forumname and no lev/pres/plat

			for(var i = 0; i < defaultIdentities.length; i++) {
				if(defaultIdentities[i].provider == "uno") {
					defaultUsername = defaultIdentities[i].username;
				}
			}
			$(".pp-header").find(".platform-selection, .pp-rank").hide();
			
		} else {
			
			menu.platformsAvailableFromGame = getPlatformsAvailableFromGame(menu.game);
			
			if(menu.platformsAvailableFromGame.length <=0) { //if user does not have game, show forum id
				
				for(var i = 0; i < defaultIdentities.length; i++) {
					if(defaultIdentities[i].provider == "uno") {
						defaultUsername = defaultIdentities[i].username;
					}
				}
				
			}
			else {
				menu.platform = menu.platformsAvailableFromGame[0];
				createPlatformDropDown(menu.platformsAvailableFromGame);
				defaultUsername = getUsername(menu.platform);
                $(".pp-header").find(".platform-selection, .pp-rank").show();
			}
		}

		//defaultUsername and menu.platform is now available
        menu.fillInPP(defaultUsername)

    };


    menu.getProfile = function(game, defaultPlatform, gamer, defaultUsername, callback) {

        var obj = {};

        COD.api.papi.crm.profile(game, defaultPlatform, gamer, defaultUsername, function(res) {
            
            var pData    = res;
            obj.username = pData.username;
            obj.level    = pData.mp.level;
            obj.prestige = pData.mp.prestige;
            obj.avatar   = HUB.mycod.methods.getRankIcon(pData.mp, game);
            obj.platform = defaultPlatform;
            
            return callback(obj);
            
        });

    };

    var setupMyCodLink = function() {

		var $cta = $(".pp-header .mycod-cta a");
		var game = menu.game;
        var pageLocale = ATVI.pageLocale;
        var localeAvail = ["en","en_GB", "en_CA", "en_AU", "pt_BR", "es_MX", "it", "es", "de", "fr", "fr_CA"];
		var cleanLocale;

        for(var i = 0; i < localeAvail.length; i++) {

            if(pageLocale == localeAvail[i]) {

                if(pageLocale == "en_GB") {
					cleanLocale == "/uk/en";
                }
                else if(pageLocale == "en_CA") {
                    cleanLocale = "/ca/en";
                }	
                else if(pageLocale == "en_AU") {
                    cleanLocale = "/au/en";
                }
                else if(pageLocale == "pt_BR") {
                    cleanLocale = "/br/pt";
                }
                else if(pageLocale == "es_MX") {
                    cleanLocale = "/mx/es";
                }
                else if(pageLocale == "fr_CA") {
                    cleanLocale = "/ca/fr";
                }
                else if(pageLocale == "en") {
                    cleanLocale = "";
                }
                else {
                    cleanLocale = "/" + localeAvail[i].toLowerCase();
                }

            }
            else {
				cleanLocale = "";
            }

        }

        var linkString = "https://my.callofduty.com" + cleanLocale + "/" + game + "/dashboard";
        $cta.attr("href", linkString);

    };

	var getPrestige = function(game, platform) {
		var plat;
		if     (platform == "psn")   plat = "p";
		else if(platform == "xbl")   plat = "x";
		else if(platform == "steam") plat = "pc";
		
		return menu.crmBlob[plat]['t'][game]["pres"];
	};
	
	var getLevel = function(game, platform) {
        var plat;
		if     (platform == "psn")   plat = "p";
		else if(platform == "xbl")   plat = "x";
		else if(platform == "steam") plat = "pc";
		return menu.crmBlob[plat]['t'][game]["lev"];
	};
	
	var getUsername = function(platform) {
		var identities = ssobar.user.identities;
		for(var i = 0; i < identities.length; i++) {
			if(identities[i].provider == platform) {
				return identities[i].username;
			} 
		}
	};

    var getRankIcon = function(game, platform) {

        var levelId = getLevel(game, platform);
        if (game === 'iw') {
            levelId = levelId < 28 ? Math.ceil(levelId / 3) :
                10 + Math.floor((levelId - 28) / 2);
        } else if (game === 'wwii') { 
            levelId = levelId >= 50 ? levelId = levelId - 31 : 
            levelId >= 40 ?  14 + Math.floor((levelId - 40) / 2) :
                Math.ceil(levelId / 3) ;
                
        }
        var prestigeIconId = getPrestige(game, platform);
        var iconName = prestigeIconId  ? 'prestige-' + prestigeIconId : 'level-' + levelId;

        var playerIconPath = '/content/dam/atvi/callofduty/mycod/common/player-icons/';
        var imgSrc = playerIconPath + game + '/' + iconName + '.png';
        return imgSrc;
    };
	
	var getPlatformsAvailableFromGame = function(game) {
		
		var platArr = [];


        $.each(menu.crmBlob, function(key,value) {

            if(key == "p") {

				if(game in menu.crmBlob["p"]["t"]) {
                    //user has game	on psn
                    platArr.push("psn");
                }

            } else if (key == "x") {

                if(game in menu.crmBlob["x"]["t"]) {
                    //user has game on xbox
                    platArr.push("xbl");
                }

            } else if (key == "pc") {

                if(game in menu.crmBlob["pc"]["t"]) {
                    //user has game on steam
                    platArr.push("steam");
                }

            }

        });

		return platArr;
		
	};

    var getCurGame = function() {

        var game;
		var url = window.location.href;

        if(url.indexOf("/iw") > 0 || url.indexOf("/infinitewarfare") > 0) game = "iw";
        else if(url.indexOf("/bo3") > 0 || url.indexOf("/blackops3") > 0) game = "bo3";
        else if(url.indexOf("/wwii") > 0 || url.split("/").length == 4) game = "wwii";
        else game = "cod";
        menu.game = game;
        return game;

    };

    var createPlatformDropDown = function(platformArr) {

		var $platformSelect = $(".pp-header .platform-selector");
        $platformSelect.find("select").empty();
        $platformSelect.find("select").append("<option disabled='disabled' value='0'>Select an account</option>");

        for(var i = 0; i < platformArr.length; i++) {

            var template = "<option value='" + platformArr[i] + "'>" + getUsername(platformArr[i]) + " (" + platformArr[i] + ")</option>";
            $platformSelect.find("select").append(template);
        }

        $platformSelect.off("change", "select", function() {

        });

        $platformSelect.on("change", "select", function() {

            var val = menu.platform = this.value;

			menu.platformChange(menu.platform); //update flyout menu
            menu.onPlatformChange(menu.platform); //update mycod page info

        });

    };

    menu.fillInPP = function(username) {

        //pp menu
		var $container = $(".player-profile-menu");

        $container.find(".pp-username").text(username);
		if(menu.platformsAvailableFromGame && menu.platformsAvailableFromGame.length > 0) {
            $container.find(".emblem").show();
			$container.find(".pp-rank .pp-level").text(getLevel(menu.game, menu.platform));
			$container.find(".pp-rank .pp-prestige").text(getPrestige(menu.game, menu.platform));
			$container.removeClass("iw bo3 wwii").addClass(menu.game);
			$container.find(".platform-selection").removeClass("steam psn xbl").addClass(menu.platform);
            $container.find(".emblem").css("background-image", "url(" + getRankIcon(menu.game, menu.platform) + ")"); 
            $(".menu-profile-name-container .emblem-sm").css("background-image", "url(" + getRankIcon(menu.game, menu.platform) + ")"); 
        } else {
			$(".pp-header").find(".platform-selection, .pp-rank").hide();
            $container.find(".emblem").css("background-image", "url()").hide(); 
            $(".menu-profile-name-container .emblem-sm").css("background-image", "url()"); 
        }

        //sso
		$(".menu-profile-name-container .profile-username").text(username);

    };

    //for flyout menu
    menu.onGameChange = function(game) { //this gets triggered on mycod app end
        menu.game = game;
		menu.initPlayerProfile();
    };

    menu.platformChange = function(platform) { //this gets triggered from flyout menu platform selection to update flyout menu info

        menu.platform = platform;
		var username = getUsername(menu.platform);
        menu.fillInPP(username);

    };

    //for mycod page info
    menu.onPlatformChange = function(platform) { //this gets triggered from flyout menu platform selection and will be overwritten on mycod app end to update the page info

    };

    $(init);

})(jQuery, COD);


// COD SUPPORT

var COD = COD || {}; 

(function($, COD) {

    var config = {
        api: {
            papiRoot: function () {
				return '/api/papi-client';
            },
            userPrefsRoot: function () {
                return '/api';
            }
        },
        gameLinks: {
            'wwii': {
                communityLink: 'https://community.callofduty.com/t5/Call-of-Duty-World-War-II/bd-p/cod-wwii-support-forum',
                serviceLink: 'https://support.activision.com/onlineservices?gameTitle=Call%20of%20Duty:%20WWII',
                supportLink: 'https://support.activision.com/Contact_Us?p=1&w2cg1=a0o0B00000EgrvkQAB&clickedOn=Call_of_Duty_WWII'
            },
            'infinitewarfare': {
                communityLink: 'https://community.callofduty.com/t5/Call-of-Duty-Infinite-Warfare/bd-p/cod-iw-support-forum',
                serviceLink: 'https://support.activision.com/onlineservices?gameTitle=Call%20of%20Duty:%20Infinite%20Warfare',
                supportLink: 'https://support.activision.com/Contact_Us?p=1&w2cg1=a0o0B000008S7evQAC&clickedOn=Call_of_Duty_Infinite_Warfare'
            },
            'blackops3': {
                communityLink: 'https://community.callofduty.com/t5/Black-Ops-3-Support/bd-p/cod-blackops3-support',
                serviceLink: 'https://support.activision.com/onlineservices?gameTitle=Call%20of%20Duty:%20Black%20Ops%20III',
                supportLink: 'https://support.activision.com/Contact_Us?p=1&w2cg1=a0o0B00000CcNz3QAF&clickedOn=Call_of_Duty_Black_Ops_III'
            },
            'modern-warfare-remastered': {
                communityLink: 'https://community.callofduty.com/t5/Modern-Warfare-Remastered/bd-p/cod-mwr-support-forum',
                serviceLink: 'https://support.activision.com/onlineservices?gameTitle=Call%20of%20Duty:%20Modern%20Warfare%20Remastered',
                supportLink: 'https://support.activision.com/Contact_Us?p=1&w2cg1=a0o0B000008S8BPQA0&clickedOn=Call_of_Duty_Modern_Warfare_Remastered'
            },
            'heroes': {
                communityLink: 'https://community.callofduty.com/t5/Call-of-Duty-Heroes-Support/bd-p/cod-heroes-support',
                serviceLink: null,
                supportLink: 'https://support.activision.com/Contact_Us?p=1&w2cg1=a0oU0000006bPNZIA2&clickedOn=Call_of_Duty_Heroes'
            },
            'advancedwarfare': {
                communityLink: 'https://community.callofduty.com/t5/Advanced-Warfare-Support/bd-p/cod-aw-support',
                serviceLink: 'https://support.activision.com/onlineservices?gameTitle=Call%20of%20Duty:%20Advanced%20Warfare',
                supportLink: 'https://support.activision.com/Contact_Us?p=1&w2cg1=a0o0B000008S8IBQA0&clickedOn=Call_of_Duty_Advanced_Warfare'
            },
            'ghosts': {
                communityLink: 'https://community.callofduty.com/t5/Call-of-Duty-Ghosts-Support/bd-p/cod-ghosts-support',
                serviceLink: 'https://support.activision.com/onlineservices?gameTitle=Call%20of%20Duty:%20Ghosts',
                supportLink: 'https://support.activision.com/Contact_Us?p=1&w2cg1=a0o0B00000CcOAvQAN&clickedOn=Call_of_Duty_Ghosts'
            },
            'blackops2': {
                communityLink: 'https://community.callofduty.com/t5/Black-Ops-II-Technical-Support/bd-p/cod-blackops2-support',
                serviceLink: 'https://support.activision.com/onlineservices?gameTitle=Call%20of%20Duty:%20Black%20Ops%20II',
                supportLink: 'https://support.activision.com/Contact_Us?p=1&w2cg1=a0o0B00000CcOHcQAN&clickedOn=Call_of_Duty_Black_Ops_II'
            },
            'mw3': {
                communityLink: null,
                serviceLink: null,
                supportLink: null
            },
            'blackops': {
                communityLink: null,
                serviceLink: null,
                supportLink: null
            }
        }
    };

    var env = function (val) {
        switch (val) {
            case 'dev': return ATVI.pageEnv === 'dev';
            case 'prod': return ATVI.pageEnv === 'prod';
            case 'cmsauthor': return window.location.hostname.split('.').indexOf('cmsauthor') !== -1;
            default: throw Error('Could not find environment: ' + '"' + val + '"');
        }
    };

    var submitForm = function (forms, path) {
        var submitBtn = forms.find('input[type=submit]');
        var showErrorMessage = function (text) {
			forms
            .closest('.tab-content')
            .find('.error-message')
            .text(text || 'Your request could not be processed at this time.')
            .show()
            .delay(7000)
            .fadeOut();
        };

        submitBtn.prop('disabled', true);

        if(env('prod')) {
			if(!isImp()) return showErrorMessage('You are not authorized to submit this request.');
        }

		return $.ajax({
               url: path,
               data: $(this).serialize(),
               type: 'POST',
               xhrFields: {
                  withCredentials: true
               }
            })
            .done(function (response) {
                if(response.status === 'error') return showErrorMessage();

                forms.find('.form-success').show();
                forms.find('.form-content').hide();

                forms.trigger('reset');

                return response;
            })
            .fail(function (xhr, text, e) {
                showErrorMessage();
            })
        	.always(function () { submitBtn.prop('disabled', false); });
    };

    var isImp = function() {
        var c = ATVI.utils.getCookie('CRM_BLOB');
        var decoded;
        var user;

        if(c) {
			decoded = atob(c);
            user = JSON.parse(decoded);

            if(user.plat) return Object.keys(user.plat).filter(function (platform) { return user.plat[platform].v === 1; }).length > 0; // check if vip on any platforms

            return false;
        }

        return false;
    };

    var ssoCookie = function () {
		var c = ATVI.utils.getCookie('ACT_SSO_COOKIE');
        var decoded;
        var infoArr;

        if(c) {
            decoded = atob(c);
            infoArr = decoded.split(':');

            return {
                hash: c,
                unoId: infoArr[0]
            };
        }

        return false;
    };

    var determineCODSite = function () {
        var links = config.gameLinks;
        var possibilities = window.location.pathname.split('/').slice(1);
        var cods = Object.keys(links);
        var site = cods.filter(function (cod) { return possibilities.indexOf(cod) !== -1; })[0];

        if(site) return links[site];

        return false;
    };

    var lazyLoadJS = function (src, callback) {
      var script = document.createElement('script');
      var firstDomScript = document.getElementsByTagName('script')[0];

      script.type = 'text/javascript';
      script.src  =  src;

      if (callback) { script.addEventListener('load', function (e) { callback(e); }); }
      firstDomScript.parentNode.insertBefore(script, firstDomScript);
    }; 

    var init = function () {

        var State = (function () {
            var sb = window.ssobar;
            var hideGuestContent = function () {
                $(".menu-support-container .s-norm .norm-bottom").hide();
            };
            var renderImpMenu = function () {
                $(".support-menu, .menu-support-container").addClass("vip");               
            };

            return {
                check: function (callback) {
                    if(sb) sb.onAuthentication(function() {
                        sb.onReady(function() {
                            callback(sb.user.isLoggedIn);
                        });
                    });
                },
                init: function () {
                    if(env('cmsauthor')) {
						//hideGuestContent();
                        renderImpMenu();
                        return;
                    }

                    this.check(function (loggedIn) {
						try {
                            if(loggedIn) {

                                hideGuestContent();

                                if(isImp()) {
                                    renderImpMenu();
                                }
        
                            }
                        } catch(e) {}
                    });
                }
            };
        })();

        var SupportMenu = (function () {
            var openCloseBtn = $('.global-nav-right .support-icon');
            var menu = $('.global-nav-container .support-menu');
            var formSuccessCloseBtn = menu.find('a.close');
            var ppMenu = $('.player-profile-menu');
            var lazyLoadLibs = function () {
				var libs = [
                    {
                        src: '/etc/designs/atvi-ui-v2/clientlibs/intl-tel-input/js/intl-tel-input.js',
                    },
                    {
                        src: '/etc/designs/atvi-ui-v2/clientlibs/intl-tel-input/js/validation.js',
                        onload: function () {
							IntlTelInput.init();
                        }
                    },
                    {
                        src: 'https://c.la1-c2-iad.salesforceliveagent.com/content/g/js/41.0/deployment.js',
                        onload: function () {
							liveagent.init('https://d.la1-c2-iad.salesforceliveagent.com/chat', '572i00000006SSU', '00Di0000000dMQF');
                            if (!window._laq) { window._laq = []; }
                            window._laq.push(function () { liveagent.showWhenOnline('573i00000006VCg', document.getElementById('liveagent_button_online_573i00000006VCg')); });


                            $('<a/>', {
                                id: 'liveagent_button_online_573i00000006VCg',
                                style: 'display: none;',
                                href: 'javascript://Chat',
                                click: function(e) { 
                                    e.preventDefault(); 
                                    liveagent.startChat('573i00000006VCg');
                                }
                            }).appendTo('body');
                        }
                    }
                ];

                libs.forEach(function (lib) {
					lazyLoadJS(lib.src, lib.onload);
                });
            };

            return {
                toggleButton: openCloseBtn,
                init: function () {
                    this.registerEvents();
                },
                registerEvents: function () {

                    $(document).click(function(){
                        menu.removeClass("active");
                    });
                    openCloseBtn.one('click', function (e) {
						lazyLoadLibs();
                    });

                    openCloseBtn.on('click', function (e) {
                        menu.toggleClass('active');
                        ppMenu.removeClass('active');
                        e.stopPropagation();
                    });
    
                    formSuccessCloseBtn.on('click', function (e) {
                        e.preventDefault();

                        menu.removeClass('active');
                        menu.find('.form-success').hide();
                        menu.find('.form-content').show();
                    });
                    menu.click(function(e){
                        e.stopPropagation();
                    });
    
                    $(window).resize(function () {
                        if(this.outerWidth <= 1140) menu.removeClass('active');
                    });
                }
            };
        })();

        var FormTabs = (function () {
            var emailTab = $('.emailus-btn');
            var textTab = $('.textus-btn');
            var tabs = $('.s-premium .s-tabs');

            return {
                init: function () {
                    textTab.addClass('selected');
                    this.registerEvents();
                },
                registerEvents: function () {
                    emailTab.on('click', function(e) {
                        e.preventDefault();
            
                        textTab.removeClass('selected');
                        emailTab.addClass('selected');
            
                        tabs.removeClass("email text").addClass("email");
                    });
            
                    textTab.on('click', function(e) {
                        e.preventDefault();
            
                        textTab.addClass('selected');
                        emailTab.removeClass('selected');
            
                        tabs.removeClass("email text").addClass("text");
                    });
                }
            };
        })();
    
        var EmailForm = (function () {
            var form = $('.email-form');
            var path = config.api.papiRoot() + '/personalization/v1/initiateEmailSupport/codMarketing';
            var changeEmailLink = form.find('a');
            var initChangeEmailLink = function () {
                if(env('dev')) changeEmailLink.attr('href', 'https://uat.callofduty.com/cod/prefs');
                else changeEmailLink.attr('href', 'https://profile.callofduty.com/cod/prefs');
            };
    
            return {
                init: function () {
                    initChangeEmailLink();
                    this.registerEvents();
                },
                registerEvents: function () {
                    form.on('submit', function (e) {
                        e.preventDefault();

                        submitForm.call(this, form, path)
                        .then(function (response) {
                            if(response.status === 'error') return;

                            var caseNumberContainer = form.find('.case-number');
                            var data = JSON.parse(response.data);
                            var status = JSON.parse(data.status);
                            var caseNumber = status['case#'];
                            var caseId = status['caseid'];
                            var link = $('<a/>', {
                                href: 'https://support.activision.com/Atvi_my_support_case_details?id='+ caseId +'&rma=0',
                                text: caseNumberContainer.data('label') + ' ' + caseNumber
                            });

                            caseNumberContainer.html(link);
                        });
                    });

                    form.find('.submit-btn').on('click', function (e) { e.preventDefault(); $(this).siblings('input[type=submit]').click(); });
                }
            };
        })();
    
        var TextForm = (function () {
            var form = $('.text-form');
            var path = config.api.papiRoot() + '/personalization/v1/initiateSmsSupport/codMarketing';
    
            return {
                init: function () {
                    this.registerEvents();
                },
                registerEvents: function () {
                    form.on('submit', function (e) {
                        e.preventDefault();

                        if(!IntlTelInput.isValid()) return false;
    
                        submitForm.call(this, form, path).then(function () { IntlTelInput.blur(); });
                    });

                    form.find('.submit-btn').on('click', function (e) { e.preventDefault(); $(this).siblings('input[type=submit]').click(); });
                }
            };
        })();

        var TextFormCheckbox = (function () {
            var checkbox = $('.t-termsAgree');
            var csrfToken = ATVI.utils.getCookie('XSRF-TOKEN');
            var sso = ssoCookie();
            var updatePrefs = function (serializedData) {
                if(env('cmsauthor')) return;

                return $.ajax({
                    type: 'POST', 
                    url: config.api.userPrefsRoot() + '/cod/updatePreferences',
                    data: serializedData,
                    headers: {'X-XSRF-TOKEN': csrfToken}
                });
            };
            var fetchUserInfo = function () {
                if(env('cmsauthor')) return $.Deferred().resolve({
                    0: {
                        codPreferences: {
                            in_game_events_sms: false,
                            in_game_events: false,
                            gameplay_help_and_tips_sms: false,
                            gameplay_help_and_tips: false,
                            news_and_community_updates_sms: false,
                            news_and_community_updates: false,
                            esports_sms: false,
                            esports: false,
                            sales_and_promotions_sms: false,
                            sales_and_promotions: false,
                        },
                        playerSupportPreferences: {
                            service_and_support: false, 
                            service_and_support_sms: false, 
                            my_support: false, 
                            my_support_sms: false
                        }
                    }
                });

				return $.ajax({
                    url: config.api.userPrefsRoot() + '/cod/userInfo/' + sso.hash,
                    jsonp: false,
                    dataType: 'jsonp',
                    jsonpCallback: 'userInfo'
                });
            };
            var fetchSubscriptions = function () {
                if(env('cmsauthor')) return $.Deferred().resolve({
                    0: {
                        cod_heroes_beta_program:{email:{identifier:"",enabled:true}},guitar_hero:{email:{identifier:"",enabled:false}},call_of_duty_news:{email:{identifier:"",enabled:true}},player_support:{email:{identifier:"",enabled:true}},cod_heroes_newsletter:{email:{identifier:"",enabled:true}},i_want_it_all:{email:{identifier:"",enabled:true}}
                    }
                });

                return $.ajax({
                    url: config.api.userPrefsRoot() + '/cod/subscriptions/' + sso.unoId,
                    headers: {'X-XSRF-TOKEN': csrfToken}
                });
            };
            var updateSMSSupport = function (userInfoResponse, subscriptionsResponse) {
                var codPrefs = userInfoResponse[0].codPreferences;
                var playerPrefs = userInfoResponse[0].playerSupportPreferences;
                var prefsDataObj = $.extend({}, codPrefs, playerPrefs, {
                    'cod__email': subscriptionsResponse[0].call_of_duty_news.email.enabled,
                    'cod-heroes-betas__email': subscriptionsResponse[0].cod_heroes_beta_program.email.enabled,
                    'cod-heroes__email': subscriptionsResponse[0].cod_heroes_newsletter.email.enabled,
                    'activision__email': subscriptionsResponse[0].i_want_it_all.email.enabled,
                    'player_support__email': subscriptionsResponse[0].player_support.email.enabled,
                    '_csrf': csrfToken, 
                    'unoId': sso.unoId
                });
                var prefsData = Object.keys(prefsDataObj)
                				.filter(function (prefKey) { return prefsDataObj[prefKey]; }) // strip false values
                                .reduce(function (obj, prefKey) {
                                    if(typeof prefsDataObj[prefKey] === 'boolean') obj[prefKey] = 'on'; 
									else obj[prefKey] = encodeURIComponent(prefsDataObj[prefKey]);

                					return obj;
                                }, {}); // create new object
                var serializeUserPrefs = function (prefs) {
                    var mainPrefs = [
						'cod__email',
						'cod-heroes-betas__email',
						'cod-heroes__email',
						'activision__email',
						'player_support__email'
                    ];

                    return Object.keys(prefs)
                    		.reduce(function (results, pref) {
								if(mainPrefs.indexOf(pref) !== -1) return results.concat(['subscriptions=' + pref], ['_subscriptions=' + prefs[pref]]); // [["subscriptions=cod__email"], [_subscriptions=on]]
                                else return results.concat([ pref + '=' + prefs[pref] ]); // ["key=value"]
                            }, [])
                    		.join('&'); // [["key=value"], ["bar=foo"]] -> "key=value&bar=foo"
                };

				// this === checkbox object
                if(this.checked) $.extend(prefsData, {
                    player_support__email: 'on',
                    service_and_support_sms: 'on',
                    my_support_sms: 'on'
                });
                else ['player_support__email', 'service_and_support_sms', 'my_support_sms'].forEach(function (key) { delete prefsData[key]; });

                updatePrefs(serializeUserPrefs(prefsData));
            };

            return {
                init: function () {
                    this.registerEvents();
                },
                registerEvents: function () {
                    checkbox.on('click', function() {
                        checkbox.prop('checked', this.checked);
						$.when(fetchUserInfo(), fetchSubscriptions()).done(updateSMSSupport.bind(this));
                    });
                }
            };
        })();

        var GuestLinks = (function () {
            var supportSiteLink = $('.sm-support-site-link a');
            var ambassadorLink = $('.sm-ambassador-link a');
            var communityLink = $('.sm-community-link a');
            var supportLink = $('.sm-support-link a');
            var serviceLink = $('.sm-service-link a');
            var linkObj = determineCODSite();
            var initSupportLink = function () {
                State.check(function (loggedIn) {
                    if(!loggedIn) supportLink.hide();
                });
            };
            var registerEvents = function () {
                ambassadorLink.on('click', function (e) {
					e.preventDefault();

                    // We do this because liveagent initialization can only be on one element, and we have two ambassador links
					document.getElementById('liveagent_button_online_573i00000006VCg').click();
                });
            };
    
            return {
                links: {
                    supportSite: supportSiteLink,
                    ambassador: ambassadorLink,
                    community: communityLink,
                    support: supportLink,
                    service: serviceLink
                },
                init: function () {
                    initSupportLink();
                    registerEvents();

                    if(linkObj) {
                        if(linkObj.communityLink) communityLink.attr('href', linkObj.communityLink);
                        if(linkObj.supportLink) supportLink.attr('href', linkObj.supportLink);
                        if(linkObj.serviceLink) serviceLink.attr('href', linkObj.serviceLink);
                    }
                },
            };
        })();

        var IntlTelInput = (function () {
            var telInput = $('.t-phonenum');
            var errorMsg = $('.t-phonenum-error');
            var validMsg = $('.t-phonenum-valid');
            var reset = function() {
              telInput.removeClass("error");
              errorMsg.addClass("hide");
              validMsg.addClass("hide");
            };

            return {
                blur: function () {
					telInput.blur(); 
                },
                isValid: function () {
                    if (!telInput) return false;
                    return telInput.intlTelInput('isValidNumber');
                },
                init: function () {
                    telInput.intlTelInput({  
                      utilsScript: "/etc/designs/atvi-ui-v2/clientlibs/intl-tel-input/js/validation.js"
                    });
                    this.registerEvents();
                },
                registerEvents: function () {
                    telInput.blur(function() {
                      reset();
                      if ($.trim(telInput.val())) {
                        if (telInput.intlTelInput("isValidNumber")) {
                          validMsg.removeClass("hide");
                        } else {
                          telInput.addClass("error");
                          errorMsg.removeClass("hide");
                        }
                      }
                    });
    
                    telInput.on('keyup change', reset);

                    // If we don't do this, intlTelInput validation won't work correctly
                    telInput.on('keyup', function (e) {
						telInput.val(e.target.value);
                    });
                }
            };
        })();

        var Analytics = (function () {
            var formButtons = $('.texting-submit input');
            var loginButtons = $('.s-login-btn a');
            var notLoggedInButtons = Object.keys(GuestLinks.links).reduce(function (jq, key) {
                                        return jq.add(GuestLinks.links[key]);
                                    }, $());
            // all buttons are jquery objects/collections
            var buttonsToTrack = [
				SupportMenu.toggleButton,
                formButtons,
                loginButtons,
                notLoggedInButtons
            ];
            var inMobileMenu = function ($el) {
                var mobileMenu = $('.global-mobile-nav').get(0);
                if($el instanceof jQuery) $el = $el.get(0);

				return $.contains(mobileMenu, $el);
            };
            var determineButton = function ($button) {
				if($button.hasClass('support-icon')) return 'support-menu-toggle-button';
                if($button.hasClass('e-submit')) return 'email-form-submit-button';
                if($button.hasClass('t-submit')) return 'text-form-submit-button';

                return $button.get(0).textContent.trim().split(' ').join('-').toLowerCase() + '-button';
            };

            return {
                init: function () {
                    // We don't want to track analytics in dev environments, please uncomment this once analytics are fully functional
                    //if(!env('prod')) return;

                    buttonsToTrack.forEach(function (button) {
                        button.on('click', function (e) {
                            if(env('dev')) {
                                console.log({
                                    event: e.type,
                                    button: determineButton($(this)),
                                    clickedFrom: inMobileMenu(this) ? 'mobile' : 'desktop'
                                });
                            }

                            ATVI.analytics.sendEvent(e.type, null, {
                                button: determineButton($(this)),
                                clickedFrom: inMobileMenu(this) ? 'mobile' : 'desktop'
                            });
                        });
                    });
                }
            };
        })();

        // IMPORTANT NOTE: IntlTelInput.init() is called after intlTelInput lib is lazy loaded. Please refer to SupportMenu module

        State.init();
        SupportMenu.init();
        FormTabs.init();
        EmailForm.init();
        TextForm.init();
        TextFormCheckbox.init();
        GuestLinks.init();
        //Analytics.init();
    };

    $(init);

})(jQuery, COD);


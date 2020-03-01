var BLOG = BLOG || {};

(function($, BLOG) {

	BLOG.posts = BLOG.posts || {};

    var init = function() {

        var postsUrl = "/content/atvi/callofduty/blog/web/" + ATVI.pageLocale + "/home.1.json";
        var masterAggregatedData = {}

        var postsJson = getJson(postsUrl, function(res) {

            var homeObj = Object.keys(res);
            for(var i = 0; i < homeObj.length; i++) {
                if(homeObj[i] != "jcr:primaryType" && 
                   homeObj[i] != "jcr:mixinTypes" && 
                   homeObj[i] != "jcr:createdBy" &&
                   homeObj[i] != "jcr:created" && 
                   homeObj[i] != "jcr:content" && 
                   homeObj[i] != "rep:policy") {

                    var folderDate = homeObj[i];

                    if(folderDate != "archives") {
                        var monthPostsUrl = "/content/atvi/callofduty/blog/web/" + ATVI.pageLocale + "/home/" + folderDate + ".infinity.json";
    
                        var monthsPostsJson = getJson(monthPostsUrl, function(res){

                            var monthPostsObj = Object.keys(res);
                            for(var j = 0; j < monthPostsObj.length; j++) {
                                if(monthPostsObj[j] != "jcr:primaryType" && 
                                   monthPostsObj[j] != "jcr:createdBy" && 
                                   monthPostsObj[j] != "jcr:content" &&  
                                   monthPostsObj[j] != "jcr:created") {
    
                                    masterAggregatedData[monthPostsObj[j]] = res[monthPostsObj[j]]["jcr:content"]["root"]["blog_layout"];
                                    masterAggregatedData[monthPostsObj[j]]["folderdate"] = folderDate;
                                    masterAggregatedData[monthPostsObj[j]]["slug"] = monthPostsObj[j];
                                }
                            }
    
                        });
                    }
                    else {

                        var archivesUrl = "/content/atvi/callofduty/blog/web/" + ATVI.pageLocale + "/home/archives.1.json";

                        var archivesPostNamesJson = getJson(archivesUrl, function(res) {

							var archivesPostNamesObj = Object.keys(res);
                            for(var k = 0; k < archivesPostNamesObj.length; k++) {
                                if(archivesPostNamesObj[k] != "jcr:primaryType" && 
                                   archivesPostNamesObj[k] != "jcr:createdBy" && 
                                   archivesPostNamesObj[k] != "jcr:content" &&  
                                   archivesPostNamesObj[k] != "jcr:created") {

                                    var postName = archivesPostNamesObj[k];

                                    var postUrl = "/content/atvi/callofduty/blog/web/" + ATVI.pageLocale + "/home/archives/" + postName + ".infinity.json";

									var postNameJson = getJson(postUrl, function(res) {

                                        var bloginfo = res["jcr:content"]["root"]["blog_layout"];

                                        masterAggregatedData[postName] = bloginfo;
                                        masterAggregatedData[postName]["folderdate"] = folderDate;
                                        masterAggregatedData[postName]["slug"] = postName;
            
                                    });
                                }
                            }

                        });

                    }
                }
            }

			var myData = BLOG.posts.masterData = masterAggregatedData;

            //sort posts by chronological order
            var masterSortedPostsArr = BLOG.posts.masterSortedPostsArr = sortAllPostsByMostRecent(myData);

			$.event.trigger("blogLoaded");
        });
    };

    var getJson = function(endpoint, callback) {

		$.ajax({
			url: endpoint,
			dataType: "json",
            async: false,
			success: function(res) {
                callback(res)
			}
		});

    };

    var sortAllPostsByMostRecent = function(myData) {

		var cleanArray = [];

        function custom_sort(a, b) {
            return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        }

		var resObj = Object.keys(myData);

        for(var i = 0; i < resObj.length; i++) {

            if(resObj[i] != "jcr:mixinTypes" && resObj[i] != "rep:policy" && resObj[i] != "jcr:primaryType" && resObj[i] != "jcr:createdBy" && resObj[i] != "jcr:created" && resObj[i] != "jcr:content") {

                var postObj = myData[resObj[i]];
                var masterObj = {};

                masterObj.blogSeries           = postObj["blogSeries"];
                masterObj.layout               = postObj["layout"];
                masterObj.gameSelection        = postObj["gameSelection"];
                masterObj.tags                 = postObj["cq:tags"];
                masterObj.author               = postObj["author"];
                masterObj.blogTitle            = postObj["blogtitle"];
                masterObj.blogSubtitle         = postObj["blogsubtitle"];
                masterObj.pubDate              = postObj["pubDate"];
                masterObj.author               = postObj["author"];
                masterObj.authorUrl            = postObj["authorUrl"];
                masterObj.featureMobileImage   = postObj["mimg"];
                masterObj.featuredDesktopImage = postObj["dimg"];
                masterObj.externalUrl          = postObj["externalUrl"];
                masterObj.dateFolder           = postObj["folderdate"];
                masterObj.slug                 = postObj["slug"];
                
                cleanArray.push(masterObj);


            }

        }

        var sortedMasterArray = cleanArray.sort(custom_sort);

        return sortedMasterArray;

    };

    //accepts a string from a search input, search ALL posts for matching words in title, excerpt, or body, creates an array of posts and returns array
    BLOG.posts.getPostsByKeyWord = function(keyword) {

		var postsArr = [];

        var masterArr = BLOG.posts.masterSortedPostsArr;

        for(var i = 0; i < masterArr.length; i++) {



        }

        return postsArr;

    }

    //acccepts a string, search ALL posts with matching game, see if each post has the series assigned to it

    BLOG.posts.getAllPostsByBlogSeries = function(series, game) {

		var postsArr = [];

        var gameArr = BLOG.posts.getPostsByGame(game);

        for(var i = 0; i < gameArr.length; i++) {

            if(gameArr[i].blogSeries == series) {
				postsArr.push(gameArr[i]);
            }

        }

        return postsArr;

    }

	//accepts a string, search ALL posts with matching game, creates an array of all games (bo4, wwii, iw, etc) and returns array. Used to create game filter
    BLOG.posts.getAllGamesFromPostsArray = function() {

        var gamesArr = [];

        var masterArr = BLOG.posts.masterSortedPostsArr;

        for(var i = 0; i < masterArr.length; i++) {

            //if(masterArr[i].gameSelection != "" && masterArr[i].newsfeed) {
            if(masterArr[i].gameSelection != "") {
                if($.inArray(masterArr[i].gameSelection, gamesArr) < 0) {
                   gamesArr.push(masterArr[i].gameSelection); 
                }
            }

        }

        return gamesArr;
    }

    //accepts a string, search ALL posts with matching gaming, creates an array of posts filtered by game and returns array
    BLOG.posts.getPostsByGame = function(game) {

        var postsArr = [];

        var masterArr = BLOG.posts.masterSortedPostsArr;

        for(var i = 0; i < masterArr.length; i++) {

            if(game == "all") {

                //if(masterArr[i].newsfeed) {
					postsArr.push(masterArr[i]); //return all posts in master list
                //}
            } 

        	//else if(masterArr[i].gameSelection == game && masterArr[i].newsfeed) {
            else if(masterArr[i].gameSelection == game) {
				postsArr.push(masterArr[i]);
            }

        }

        return postsArr;
    }

    //accepts an array of posts, get all the tags from posts, creates an array of tags and returns array. Used to create tags filter
    BLOG.posts.getAllTagsFromPostsArray = function(postsArr) {

        var tagsArr = [];

        for(var i = 0; i < postsArr.length; i++) {
            
            //if(postsArr[i].tags.length > 0 && postsArr[i].newsfeed) {
            if(postsArr[i].tags) {

                if(postsArr[i].tags.length > 0) {
                
                    for(var k = 0; k < postsArr[i].tags.length; k++) {
                        
                        var parts = postsArr[i].tags[k].split("/");
                        var final = parts[parts.length - 1];
    
                        if($.inArray(final, tagsArr) < 0) {
                            tagsArr.push(final); 
                        }
                        
                    }
                }
            }
            
        }

        return tagsArr;
    }

    //accepts 2 strings (tag and game), search ALL posts or posts associated with a particular game matching a tag, creates an array of posts and returns array. Used when user clicks on game or tag filter
    BLOG.posts.getPostsByTagAndGame = function(tag, game) {

        var postsArr = [];

        var gameArr = BLOG.posts.getPostsByGame(game);

        //if(gameArr.length == 0) gameArr = BLOG.posts.masterSortedPostsArr;

        for(var i = 0; i < gameArr.length; i++) {

            if(tag == "all") {
				postsArr.push(gameArr[i]);
            }

            else {

                if(gameArr[i].tags) {
                    for(var j = 0; j < gameArr[i].tags.length; j++) {
    
                        var parts = gameArr[i].tags[j].split("/");
                        var final = parts[parts.length - 1];
        
                        if(tag == final) {
                            postsArr.push(gameArr[i]);
                        }
    
                    }
                }
            }
        }

        return postsArr;

    }

    //accepts a tag array (from one post), creates a string of tags, spaced, and returns string. Used for applying tag names as classes to post container
    BLOG.posts.getTagsFromPostAsString = function(tagArray) {

		var tagString = "";

        for(var i = 0; i < tagArray.length; i++) {

            var parts = tagArray[i].split("/");
            var final = parts[parts.length - 1];

			tagString += final + " ";

        }

        return tagString; 

    }

    //init();

})(jQuery, BLOG);





var ATVI = ATVI || {};

(function($, ATVI) {

	var ld = ATVI.utils.localeDetector,
        region = undefined;


    ld.getRegion(function(d) {
        region = d;
    });

    var init = function() {
		if (region == 'ca') addPrivacyLink();
    };

    var addPrivacyLink = function() {
        var item = $('<li/>'),
            separator = $('<li/>', { 'class': 'desktop-only', 'text': '|' }),
            anchor = $('<a/>', { 'href':'http://activisionblizzard.com/legal/ccpa', 'text': 'Do Not Sell My Personal Information', 'target': '_blank' });
        $('.cod-global-footer .footer-links > ul').append([item.append(anchor), separator]);
    };

    $(init);

})(jQuery, ATVI);

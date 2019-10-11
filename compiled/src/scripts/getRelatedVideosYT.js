function getRelatedVideosYT(videoID) {
    return new Promise(function (resolve, reject) {
        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            type: 'video',
            topicId: '/m/04rlf',
            relatedToVideoId: videoID,
            maxResults: 50
        });
        request.execute(function (response) {
            resolve(response.result.items);
        });
    });
}
//# sourceMappingURL=getRelatedVideosYT.js.map
function getRelatedVideosYT(videoID) {
  return new Promise((resolve, reject) => {
    let request = gapi.client.youtube.search.list({
      part: 'snippet',
      type: 'video',
      topicId: '/m/04rlf',
      relatedToVideoId: videoID,
      maxResults: 50
    })

    request.execute((response) => {
      resolve(response.result.items)
    })
  })
}
var apiCallerApp = new Vue({
	el: '#apiCallerDiv',
	data : {
      similarity_response: {
        responses: [
          {
            webDetection: {
              webEntities: [
                {
                  entityId: '',
                  score: 0,
                  description: ''
                },
              ],
              partialMatchingImages: [
                {
                  url: '',
                  score: 0
                },
              ],
              pagesWithMatchingImages: [
                {
                  url: '',
                  score: 0
                },
              ],
              bestGuessLabels: [
                {
                  label: 'Best guess will appear here'
                }
              ],
              visuallySimilarImages: [
                {
                  url: 'images/sample.jpg'
                }
              ]
            }
          }
        ]
      }
		},
	  methods: {
      detectSimilarImages() {
				// document.getElementById('image-card').style.visibility = 'visible';
        var files = document.getElementById('src-img').files;
        if (files.length > 0) {
          var reader = new FileReader();
          reader.readAsDataURL(files[0]);
          reader.onload = function () {
            apiCallerApp.fetchSimilarImageResults(reader.result.split(',')[1]);
						var output = document.getElementById('src-decoded');
						output.style.visibility = 'visible';
      			output.src = reader.result;
            // console.log("sadjahgsdagsdgahsdgahdgs",reader.result.split(',')[1]);
          };
					// reader.readAsDataURL(event.target.files[0]);
          reader.onerror = function (error) {
            console.log('Error: ', error);
          };
        }
        else {
          console.error('Couldn\'t upload the file');
				}
      },
			getNerdStats() {
				// document.getElementById('image-card').style.visibility = 'visible';
        var files = document.getElementById('src-img').files;
        if (files.length > 0) {
          var reader = new FileReader();
          reader.readAsDataURL(files[0]);
          reader.onload = function () {
            apiCallerApp.getNerdFaceLabels(reader.result.split(',')[1]);
						apiCallerApp.getNerdObjectLabels(reader.result.split(',')[1]);
						apiCallerApp.getNerdTextLabels(reader.result.split(',')[1]);
						apiCallerApp.getSafeSearchLabels(reader.result.split(',')[1]);
          };
          reader.onerror = function (error) {
            console.log('Error: ', error);
          };
        }
        else {
          console.error('Couldn\'t upload the file');
				}
      },
      fetchSimilarImageResults(src_b64) {
				fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAdxg74BGS4CF4-VNCNp9fhqrMR_8FzeFQ', {
					body : JSON.stringify({
    				requests : [
                {
                  image: {
                    content: src_b64
                  },
                  features: [
                    {
                      type: "WEB_DETECTION",
                      maxResults: 20
                      }
                    ]
                  }
                ]
  				    }),
					     mode: "cors", // no-cors, cors, *same-origin
					     headers: {
    				    'Accept': 'application/json, text/plain, */*',
    				    'Content-Type': 'application/json; charset=utf-8'
  				    },
					     method: "POST"
				    }
			   )
				 .then((res) => {
        return res.json();
      	})
					.then (json => {
					 	// console.log(json.responses[0].landmarkAnnotations[0].mid)
            console.log(json);
 						apiCallerApp.similarity_response = json;
 						// console.log(apiCallerApp.response);
						// document.getElementById("plotButton").style.visibility = "visible";
						// apiCallerApp.pushSimilarImagesData(json);
 				})
  			.catch( function(err){
  				console.log(err)
  			})
			},

			getSafeSearchLabels(src_b64) {
				fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAdxg74BGS4CF4-VNCNp9fhqrMR_8FzeFQ', {
					body : JSON.stringify({
    				requests : [
                {
                  image: {
                    content: src_b64
                  },
                  features: [
                    {
                      // type: "WEB_DETECTION",
											// type: "OBJECT_LOCALIZATION",
											// type: "FACE_DETECTION",
											type: "SAFE_SEARCH_DETECTION",
                      maxResults: 10
                      }
                    ]
                  }
                ]
  				    }),
					     mode: "cors", // no-cors, cors, *same-origin
					     headers: {
    				    'Accept': 'application/json, text/plain, */*',
    				    'Content-Type': 'application/json; charset=utf-8'
  				    },
					     method: "POST"
				    }
			   )
					.then((res) => {
        		return res.json();
      		})
					.then (json => {
 						apiCallerApp.safe_search_response = json;
						console.log(json);
						apiCallerApp.violence_bool =false;
						apiCallerApp.medical_bool = false
						apiCallerApp.spoof_bool =false;
						apiCallerApp.racy_bool =false;
						apiCallerApp.adult_bool = false;
						if (json.responses[0].safeSearchAnnotation.violence == "VERY_LIKELY" || json.responses[0].safeSearchAnnotation.violence == "POSSIBLE" || json.responses[0].safeSearchAnnotation.violence == "LIKELY") {
							apiCallerApp.violence_bool = true;
						}
						if (json.responses[0].safeSearchAnnotation.medical == "VERY_LIKELY" || json.responses[0].safeSearchAnnotation.medical == "POSSIBLE" || json.responses[0].safeSearchAnnotation.medical == "LIKELY") {
							apiCallerApp.medical_bool = true;
						}
						if (json.responses[0].safeSearchAnnotation.spoof == "VERY_LIKELY" || json.responses[0].safeSearchAnnotation.spoof == "POSSIBLE" || json.responses[0].safeSearchAnnotation.spoof == "LIKELY") {
							apiCallerApp.spoof_bool = true;
						}
						if (json.responses[0].safeSearchAnnotation.racy == "VERY_LIKELY" || json.responses[0].safeSearchAnnotation.racy == "POSSIBLE" || json.responses[0].safeSearchAnnotation.racy == "LIKELY") {
							apiCallerApp.racy_bool = true;
						}
						if (json.responses[0].safeSearchAnnotation.adult == "VERY_LIKELY" || json.responses[0].safeSearchAnnotation.adult == "POSSIBLE" || json.responses[0].safeSearchAnnotation.adult == "LIKELY") {
							apiCallerApp.adult_bool = true;
						}
						// apiCallerApp.aggregateTextStats(json);
 						// console.log(apiCallerApp.face_detection_response.responses[0].faceAnnotations[0].joyLikelihood);
 				})
  			.catch( function(err){
  				console.log(err)
  			})
			},
			formatDate(date, days) {
				date.setDate(date.getDate() + days);
    		return date.toISOString().split('T')[0];
			},

      openImage(url) {
        window.open(url,'Image','width=50px,resizable=1');
      },
	  },
    created: function() {
    }
	})

app.service('wikipediaService', ['$q', '$http', function ($q, $http) {

    var hasNumber = function (string) {
        return /\d/.test(string);
    }

    return {
        getInventions: function () {
            var deferred = $q.defer();
            var self = this;

            $http({
                method: 'GET',
                url: 'https://en.wikipedia.org/w/api.php?action=query&titles=List_of_inventors&prop=revisions&rvprop=content&rvslots=main&format=json',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                 },
                withCredentials: true,
            }).then(function successCallback(resp) {
                var final = self.parseResponse(resp);
                deferred.resolve(final);
            }, function errorCallback(resp) {
                console.log(resp);
            });

            return deferred.promise;
        },
        parseResponse: function (resp) {
            // Map the response in an object for better access.
            var obj = Object.keys(resp.data.query.pages).map(function (key) {
                return [Number(key), resp.data.query.pages[key]];
            });

            // Storing only the list (content) of inventors and inventions (raw).
            var temp = obj[0][1].revisions[0].slots.main['*'];

            // Deleting some useless text at the begining.
            temp = temp.substring(temp.indexOf("===A===") + 7);
            // We also removing some more useless text.
            temp = temp.replace(/\[/g, '');
            temp = temp.replace(/]/g, '');
            temp = temp.replace(/\===.*?\===/g, '');
            temp = temp.replace(/\==.*?\==/g, '');
            temp = temp.replace(/\<ref>.*?\<\/ref>/g, '');
            temp = temp.replace(/,/g, ', ');

            // We split each inventor with his/her invention into an array.
            var temp2 = [];
            temp2 = temp.split('*');

            var final = [{}];
            for (var i = 0; i < temp2.length; i++) {

                // We split inventor and his/her invention into a seperate array object.
                if (temp2[i].indexOf(' – ') != temp2[i].lastIndexOf(' – ') && temp2[i].indexOf(' – ') != -1) {
                    var arr = temp2[i].split(' – ');
                    var lastVar = arr.pop();
                    var restVar = arr.join(' – ');
                    arr[0] = restVar;
                    arr[1] = lastVar;
                } else {
                    var arr = temp2[i].split(' – ');
                }

                if (arr[1] && arr[1].length > 0) {

                    // We store the country to a seperate object and delete it from the inventor object.
                    var country = arr[0].split("),").pop();
                    arr[0] = arr[0].substring(0, arr[0].indexOf('),') + 1);

                    // Find and split the born dates.
                    var startPos = arr[0].lastIndexOf('(') + 1;
                    var endPos = arr[0].lastIndexOf(')');
                    var textToGet = arr[0].substring(startPos, endPos);

                    // If dates string has numbers (means it truely is a date) store it in a seperate object and delete the string from the inventor object.
                    if (hasNumber(textToGet) || textToGet.indexOf('?') != -1) {
                        var born = textToGet;
                        born = born.replace('–', ' – ');
                        born = born.replace('born', '');
                        arr[0] = arr[0].replace('(' + textToGet + ')', '');
                    }

                    // We remove (again...) some useless text before the | character.
                    arr[0] = arr[0].substring(arr[0].indexOf("|") + 1);
                    arr[1] = arr[1].substring(arr[1].indexOf("|") + 1);

                    // We make every starting letter of the inventior and the invention uppercase.
                    arr[0] = arr[0].charAt(0).toUpperCase() + arr[0].slice(1);
                    arr[1] = arr[1].charAt(0).toUpperCase() + arr[1].slice(1);

                    // We push each inventor / invension into the final object.
                    final.push({
                        'inventor': arr[0],
                        'country': country,
                        'born': born,
                        'invention': arr[1],
                    });
                }
            }

            // Removing the first object element as it is empty.
            final.shift();

            // Returning the final (parsed) object into the $scope variable for displaying.
            return final;
        }
    }
}]);

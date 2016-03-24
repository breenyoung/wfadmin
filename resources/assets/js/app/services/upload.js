(function(){
    "use strict";

    angular.module("app.services").factory('UploadService', ['Upload', function(Upload) {

        return {

            uploadFile: function (id, uploadType, file)
            {
                console.log('in upload');

                Upload.upload({
                    url: 'api/uploader/uploadFile',
                    data: {file: file, id: id, uploadType: uploadType}
                }).then(function (resp)
                {
                    //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                }, function (resp)
                {
                    console.log('Error status: ' + resp.status);
                }, function (evt)
                {
                    //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }

        };

    }]);

})();
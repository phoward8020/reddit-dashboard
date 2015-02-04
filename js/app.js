var redditApp = angular.module("RedditApp", []);
redditApp.run(function(){
  console.log('App Started!');
});

redditApp.controller("SearchController", ["$scope", "$http", "$window", function($scope, $http, $window) {
  console.log('SearchController online!');
  $scope.selectedSearchTerm = 0;
  $scope.searchTerm = "";
  $scope.results = [];
  try {
    $scope.searchHistory = JSON.parse(window.localStorage.searchHistory) || [];
  } catch(e) {
    console.log('error: ', e);
    $scope.searchHistory = [];
  }


  $scope.search = function() {
    console.log('search() triggered.');
    if ($scope.searchTerm.length == 0) {
      return;
    }

    var req = {
        url: "http://www.reddit.com/search.json",
        params: {
          q: $scope.searchTerm
        } 
      };

    $http(req).success(function(results) {
      console.log('search term: ', $scope.searchTerm);
      console.log('request: ', req);
      console.log('search returned: ', results);
      if ($scope.searchHistory.indexOf($scope.searchTerm) < 0) {
        $scope.searchHistory.unshift($scope.searchTerm);
      };
      console.log($scope.searchHistory);
      
      $scope.posts = results.data.children;
      console.log("$scope.posts: ", $scope.posts);
      // $scope.loading = false;

      window.localStorage.searchHistory = JSON.stringify($scope.searchHistory);

      $scope.thumbedPosts = [];
      $scope.posts.forEach(function(element, index){
        if (element.data.thumbnail.indexOf("http") == 0) $scope.thumbedPosts.push(element);
      });
      console.log("$scope.thumbedPosts: ", $scope.thumbedPosts);
    });
  };

  $scope.$watch("searchTerm", function(newVal, oldVal) {
      if (newVal) {
        window.localStorage.searchTerm = $scope.searchTerm;
      }
    });

  $scope.searchFromHistory = function(index) {
    $scope.searchTerm = $scope.searchHistory[index];
    $scope.search();
  };

  $scope.isCurrentSearch = function(index) {
    if ($scope.searchHistory[index] == $scope.searchTerm) {
      return true;
    } else {
      return false;
    }; 
  }

  $scope.delete = function(index){
    console.log("delete() called on index: ", index);
    $scope.searchHistory.splice(index, 1);
    window.localStorage.searchHistory = JSON.stringify($scope.searchHistory);
  };

}]);

'use strict';

describe('Controller: ChatCtrl', function () {

  beforeEach(module('gcastCapstoneApp'));

  var ChatCtrl;
  var scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChatCtrl = $controller('ChatCtrl', { $scope: scope });
  }));

  it('should change the username', function () {
    scope.newUsername = 'mike';
    scope.registerUser();

    expect(scope.username).toBe('mike');
  });
});

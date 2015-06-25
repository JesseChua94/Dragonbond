Template.layout.helpers({
  'active' : function(template){
  	var currentRoute = Router.current();
  	return currentRoute && 
  	template === currentRoute.route.getName() ? 'active' : ''
    }
  });
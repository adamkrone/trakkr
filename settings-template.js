(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['settings'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n	<option value=\"";
  depth0 = typeof depth0 === functionType ? depth0() : depth0;
  buffer += escapeExpression(depth0) + "\">";
  depth0 = typeof depth0 === functionType ? depth0() : depth0;
  buffer += escapeExpression(depth0) + "</option>\n	";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "";
  buffer += "\n	<option value=\"";
  depth0 = typeof depth0 === functionType ? depth0() : depth0;
  buffer += escapeExpression(depth0) + "\">";
  depth0 = typeof depth0 === functionType ? depth0() : depth0;
  buffer += escapeExpression(depth0) + "</option>\n	";
  return buffer;}

  buffer += "<p><label><strong>Change Session</strong></label></p>\n<p><select id=\"changeSession\">\n	";
  stack1 = depth0.sessionNames;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	<option value=\"\"></option>\n	<option value=\"new\">Add Session</option>\n</select></p>\n\n<p><input type=\"text\" id=\"newSessionName\" placeholder=\"Session Name\"></p>\n\n<p><input type=\"submit\" id=\"submitChangeSession\" value=\"Change Session\"></p>\n\n<p><label><strong>Delete Session</strong></label></p>\n<p><select id=\"deleteSession\">\n	";
  stack1 = depth0.sessionNames;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</select></p>\n\n<p><input type=\"submit\" id=\"submitDeleteSession\" value=\"Delete Session\"></p>";
  return buffer;});
})();
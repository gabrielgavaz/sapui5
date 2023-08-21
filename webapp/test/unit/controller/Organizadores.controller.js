/*global QUnit*/

sap.ui.define([
	"evento/evento-proyecto1/controller/Organizadores.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Organizadores Controller");

	QUnit.test("I should test the Organizadores controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});

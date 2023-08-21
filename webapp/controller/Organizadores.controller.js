sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("evento.eventoproyecto1.controller.Organizadores", {
            onInit: function () {

            },


            //Filtrar por nombre o por apellido
            onFilter: function () {
              var sNombre = this._capitalizeFirstLetter(this.byId("organizadorInputNombre").getValue());
              var sApellido = this._capitalizeFirstLetter(this.byId("organizadorInputApellido").getValue());
           
              var aFilters = [];
           
              if (sNombre) {
                 var oNombreFilter = new sap.ui.model.Filter("Nombre", sap.ui.model.FilterOperator.Contains, sNombre);
                 aFilters.push(oNombreFilter);
              }
           
              if (sApellido) {
                 var oApellidoFilter = new sap.ui.model.Filter("Apellido", sap.ui.model.FilterOperator.Contains, sApellido);
                 aFilters.push(oApellidoFilter);
              }
           
              var oList = this.byId("listaOrganizadores");
              var oBinding = oList.getBinding("items");
              
              if (oBinding) {
                 oBinding.filter(aFilters);
              } else {
                 oList.attachEventOnce("updateFinished", function () {
                    oBinding = oList.getBinding("items");
                    oBinding.filter(aFilters);
                 });
              }
            },

            //tranformar la primera letra en mayuscula para poder filtrar mejor
            _capitalizeFirstLetter: function (sValue) {
              return sValue.charAt(0).toUpperCase() + sValue.slice(1);
            },
           


            //Limpiar filtros y devolver la lista completa
            onClearFilter: function () {
              var oInputNombre = this.getView().byId("organizadorInputNombre");
              var oInputApellido = this.getView().byId("organizadorInputApellido");
              oInputNombre.setValue("");
              oInputApellido.setValue("");
          
              var oList = this.byId("listaOrganizadores");
              var oBinding = oList.getBinding("items");
          
              if (oBinding) {
                  oBinding.filter([]); // Eliminar cualquier filtro existente
              } else {
                  oList.attachEventOnce("updateFinished", function () {
                      oBinding = oList.getBinding("items");
                      oBinding.filter([]); // Eliminar cualquier filtro existente
                  });
              }
            },


            //navegacion a detalles del organizador
            NavToOrganizador_Detail: function(oEvent){
              var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
              var selectedIdOrgevento = oEvent.getSource().getBindingContext().getProperty("IdOrgevento");
              console.log(selectedIdOrgevento);
              oRouter.navTo("RouteOrganizador_Detail", {
                  IdOrgevento: selectedIdOrgevento
              });
            }
        });
    });

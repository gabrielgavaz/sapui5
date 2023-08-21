sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, formatter, Fragment, MessageToast, MessageBox) {
        "use strict";

        return Controller.extend("evento.eventoproyecto1.controller.Organizador_Detail", {
            formatter: formatter,
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrganizador_Detail").attachMatched(this._onRouteMatched, this);

            },


            //match
            _onRouteMatched: function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                console.log(oArgs)
                oView = this.getView();
                oView.bindElement({
                    path: "/organizadorSet('" + oArgs.IdOrgevento + "')",
                    events: {
                        dataRequested: function () {
                            oView.setBusy(true);
                        },
                        dataReceived: function () {
                            oView.setBusy(false);
                        }
                    }
                });
            },


            //abrir fragmento "CrearEvento"
            onOpenFragmentCrearEvento: function(){
                var oView = this.getView();
                var oController = this; // Captura la referencia al controlador
            


                if (!this.byId('dialogCrearEvento')) {
                    Fragment.load({
                        name: "evento.eventoproyecto1.view.fragment.CrearEvento",
                        controller: this,
                        id: oView.getId()
                    }).then(function(oDialog){
                        oController._oDialog = oDialog; 
                        oDialog.open();
                    });
                } else {
                    this.byId('dialogCrearEvento').open();
                }

            },
            //Cerrar fragment
            onCloseDialog: function(){
                var oView = this.getView();

                oView.byId("nombreEventoCreate").setValue("");
                oView.byId("nombreSalonCreate").setValue("");
                oView.byId("calleSalonCreate").setValue("");
                oView.byId("numeroSalonCreate").setValue("");
                oView.byId("ciudadSalonCreate").setValue("");
                oView.byId("fechaEvento").setValue("");
            
                this._oDialog.close();
            },
            
            //CrearEvento
            onCreateEvento: function(oEvent){

                var oView = this.getView();

                var nombreEvento = oView.byId("nombreEventoCreate").getValue();
                var nombreSalon = oView.byId("nombreSalonCreate").getValue();
                var calleSalon = oView.byId("calleSalonCreate").getValue();
                var numeroSalon = oView.byId("numeroSalonCreate").getValue();
                var ciudadSalon = oView.byId("ciudadSalonCreate").getValue();
                var fechaEvento = oView.byId("fechaEvento").getDateValue();
            
                if (!nombreEvento || !nombreSalon || !calleSalon || !numeroSalon || !ciudadSalon || !fechaEvento) {
                    MessageToast.show("Por favor, complete todos los campos obligatorios.");
                    return;
                }
            
                if (!isNaN(numeroSalon) && parseInt(numeroSalon) <= 0) {
                    MessageToast.show("El número del salón debe ser mayor que cero.");
                    return;
                }
            
                if (!fechaEvento) {
                    MessageToast.show("Seleccione una fecha para el evento.");
                    return;
                }
            
                if (fechaEvento < new Date()) {
                    MessageToast.show("La fecha del evento debe ser en el futuro.");
                    return;
                }            

                var oView = this.getView();
                var oController = this; // Captura la referencia al controlador

                // Obtener el IdPais de la ruta de navegación
                var oContext = oEvent.getSource().getBindingContext();
                this._oDialog.setBindingContext(oContext).open();
            
                // Obtener el IdPais de la ruta de navegación
                var sIdOrgevento = this.getView().getBindingContext().getProperty("IdOrgevento");
                console.log("IdOrgevento:", sIdOrgevento);
                var sEstadoEvento= "P";
                var oModel = oView.getModel();
                var oNewEvento = {
                  IdOrgevento: sIdOrgevento,
                  NombreEvento: oView.byId("nombreEventoCreate").getValue(),
                  NombreSalon: oView.byId("nombreSalonCreate").getValue(),
                  CalleSalon: oView.byId("calleSalonCreate").getValue(),
                  NumeroSalon: oView.byId("numeroSalonCreate").getValue(),
                  CiudadSalon: oView.byId("ciudadSalonCreate").getValue(),
                  FechaEvento: new Date(oView.byId("fechaEvento").getDateValue()),
                  EstadoEvento: sEstadoEvento
                };
                console.log(oNewEvento)

                //Llamar al método create_entity con los datos del nuevo evento
                oModel.create("/eventoSet", oNewEvento, {
                success: function() {
                  MessageToast.show("evento creado exitosamente");
                  oController._oDialog.close();
                },
                error: function(oError) {
                  MessageToast.error("Error al crear el evento");
                }
              });
            },


            //Eliminar evento
            onDeleteEvento: function(oEvent) {
                var oContext = oEvent.getSource().getBindingContext().getObject();
                console.log(oContext);
                MessageBox.confirm("Estas seguro de eliminar el evento \n Esta accion eliminará a todos los invitados registrados a este evento ", {
                    title: "Confirm",
                    onClose: function(sAction) {
                        if (sAction === 'OK') {
                            this.onDeleteSpecificRecord(oContext);
                        }
                    }.bind(this),
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                });
            },
            
            onDeleteSpecificRecord: function(oRecord) {
                console.log(oRecord + "especificrecod");
                var oView= this.getView()
                var oDataModel = oView.getModel()
                oDataModel.remove("/eventoSet(IdEvento='"+ oRecord.IdEvento +"',IdOrgevento='"+ oRecord.IdOrgevento +"')",{
                    success: function(oResponse){
                        MessageToast.show("el evento se elimino correctamente")
                    }.bind(this),
                    error: function(oError){
                        MessageToast.show("Ha ocurrido un error al eliminar el evento")
                    }.bind(this)
                });
            },

            //Abrir dialogo "UpdateEvento"
            onOpenFragmentUpdateEvento: function(){
                var oView = this.getView();
                var oController = this; // Captura la referencia al controlador
            
                if (!this.byId('dialogUpdateEvento')) {
                    Fragment.load({
                        name: "evento.eventoproyecto1.view.fragment.UpdateEvento",
                        controller: this,
                        id: oView.getId()
                    }).then(function(oDialog){
                        oController._oDialog = oDialog; 
                        oDialog.open();
                    });
                } else {
                    this.byId('dialogUpdateEvento').open();
                }
            }

        });
    });

sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], function(Controller) {
    "use strict";
  
    return {
        formatEstado: function (sEstado) {
            switch (sEstado) {
                case 'P':
                    return "Pendiente";
                case 'C':
                    return "Cancelado";
                case 'F':
                    return "Finalizado";
                default:
                    return "Desconocido";
            }
        },

        getStateColor: function (sEstado) {
            switch (sEstado) {
                case 'P':
                    return sap.ui.core.ValueState.Warning;
                case 'C':
                    return sap.ui.core.ValueState.Error;
                case 'F':
                    return sap.ui.core.ValueState.Success;
                default:
                    return sap.ui.core.ValueState.None;
            }
        }
    };
  });
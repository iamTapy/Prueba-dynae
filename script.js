$(document).ready(function () {
    //Es una funcion de la libreria de datatable, que nos trae todo los datos de una columna y se usa para los cuatro filtros, 
    //cada vez que se cree o se rehaga la tabla
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) { 
            let valorTablaGenero = data[8];
            let valorTablaEstado = data[10];
            let valorTablaPais = data[11];
            let valorTablaTarjeta = data[12];
            if (!filtrarGenero(valorTablaGenero)) {
                return false;
            }
            if (!filtrarEstado(valorTablaEstado)) {
                return false;
            }
            if (!filtrarPais(valorTablaPais)) {
                return false;
            }
            if (!filtrarTarjeta(valorTablaTarjeta)) {
                return false;
            }
            return true;
            
            
        }
    );
});

//Aqui preguntamos si los combobox estan en 0 o si se eligio una opcion
function filtrarGenero(valorTablaGenero) {
    let valorComboBox = $('#idGender').val();
    if (valorComboBox == 0) {
        return true;
    }else if (valorComboBox == valorTablaGenero){
        return true;
    }else{
        return false;
    }
}
function filtrarEstado(valorTablaEstado) {
    let valorComboBox = $('#idState').val();
    if (valorComboBox == 0) {
        return true;
    }else if (valorComboBox == valorTablaEstado){
        return true;
    }else{
        return false;
    }
}
function filtrarPais(valorTablaPais) {
    let valorComboBox = $('#idCountry').val();
    if (valorComboBox == 0) {
        return true;
    }else if (valorComboBox == valorTablaPais){
        return true;
    }else{
        return false;
    }
}
function filtrarTarjeta(valorTablaTarjeta) {
    let valorComboBox = $('#idTarjeta').val();
    if (valorComboBox == 0) {
        return true;
    }else if (valorComboBox == valorTablaTarjeta){
        return true;
    }else{
        return false;
    }
}

//Validaciones para lo que se ingresa en el campo de texto
$( "#btnBuscar" ).click(function() {
    var size = $('#idSize').val();

    if (!isNaN(size)) {
        if (size <= 100  && size > 0) {
            $("#example").dataTable().fnDestroy();
            cargarDatos(size);
        }else{
           alert("Ingrese un numero entre los valores indicados")
        }
    }else{
        alert("Ingrese un valor numerico");
    }
});

//Llamada a la api y relleno de la tabla
function cargarDatos(size){
    $.ajax({
        type: 'GET',
        url: 'https://random-data-api.com/api/v2/users?size='+size+'&is_xml=true',
        contentType: false,
        processData: false,
        success: function(data) {
        var gender = [];
        var country = [];
        var state = [];
        var tarjeta = [];
        var html = '';
        if (data.length != undefined) {
            for (var i = 0; i < data.length; i++) {
                llenarArreglos(data[i] ,gender ,country ,state ,tarjeta)
        
                html += '<tr>' +
                '<td>' + data[i].id  +'</td>' +
                '<td> <img width="100%" src="'+ data[i].avatar+'"> </td>' +
                '<td>' + data[i].first_name + ' ' + data[i].last_name +'</td>' +
                '<td>' + data[i].email  +'</td>' +
                '<td>' + data[i].phone_number  +'</td>' +
                '<td>' + data[i].date_of_birth  +'</td>' +
                '<td>' + data[i].employment.title+ '(' + data[i].employment.key_skill + ')'  +'</td>' +
                '<td>' + data[i].username + '</td>' +
                '<td>' + data[i].gender +  '</td>' +
                '<td>' + data[i].address.city  + ', ' + data[i].address.street_name + ', ' + data[i].address.street_address +  '</td>' +
                '<td>' + data[i].address.state  +  '</td>' +
                '<td>' + data[i].address.country  +  '</td>' +
                '<td>' + data[i].subscription.status  +  '</td>'  
            }
        }else{
            llenarArreglos(data ,gender ,country ,state ,tarjeta)
            html += '<tr>' +
                '<td>' + data.id  +'</td>' +
                '<td> <img width="100%" src="'+ data.avatar+'"> </td>' +
                '<td>' + data.first_name + ' ' + data.last_name +'</td>' +
                '<td>' + data.email  +'</td>' +
                '<td>' + data.phone_number  +'</td>' +
                '<td>' + data.date_of_birth  +'</td>' +
                '<td>' + data.employment.title  +'</td>' +
                '<td>' + data.username + '</td>' +
                '<td>' + data.gender +  '</td>' +
                '<td>' + data.address.city  + ', ' + data.address.street_name + ', ' + data.address.street_address +  '</td>' +
                '<td>' + data.address.state  +  '</td>' +
                '<td>' + data.address.country  +  '</td>' +
                '<td>' + data.subscription.status  +  '</td>'
        }

        agregarCombobox(gender, "#idGender", " genero");
        agregarCombobox(country, "#idCountry", " pais");
        agregarCombobox(state, "#idState", " estado");
        agregarCombobox(tarjeta, "#idTarjeta", " estado de la tarjeta");
        //Aqui se llena el contenido de la tabla
        $('#tablaResultados').html(html);
        
        $('#example').DataTable({
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron resultados",
                    "info": "Registros del _START_ al _END_ de _TOTAL_ registros",
                    "infoEmpty": "Registros del 0 al 0 de 0 registros",
                    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "sSearch": "Buscar:",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast":"Último",
                        "sNext":"Siguiente",
                        "sPrevious": "Anterior"
                        },
                        "sProcessing":"Procesando...",
                }
            });
            $('.invisible').removeClass("invisible")
            },
            error: function(jqXHR, textStatus, errorThrown) {
            alert('Error...');
            }
        });
}

//Esta es la funcion que le pasamos a los select para que cuando cambien hagan de nuevo la tabla
function filterTable() {
    $('#example').DataTable().draw();
}

//Funcion para preguntar si ya existe esa palabra en arreglo, si no es asi se agregara al arreglo
function llenarArreglos(data ,gender ,country ,state ,tarjeta){
    if (!gender.includes(data.gender)) {
        gender.push( data.gender);
    } 

    if (!country.includes(data.address.country)) {
        country.push( data.address.country);
    }

    if (!state.includes(data.address.state)) {
        state.push( data.address.state);
    }

    if (!tarjeta.includes(data.subscription.status)) {
        tarjeta.push( data.subscription.status);
    }
}
//Lo que se encuentra en los arreglos se agregara al combobox
function agregarCombobox(arreglo , id , texto) {
    var html = '<option value="0" >Seleccionar' + texto + '</option>';
    for (let i = 0; i < arreglo.length; i++) {
        html += '<option value="'+ arreglo[i] +'">' + arreglo[i] + '</option>'
    }
    $(id).html(html);
}


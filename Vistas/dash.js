"use strict";
 //import { newDataSend } from "./utils";

document.addEventListener("DOMContentLoaded", function () {

    const nav = document.getElementById("nav");
    const sidebar = document.getElementById('sidebar');
    const sidebar2 = document.getElementById('sidebar2');
    const sidebar3 = document.getElementById('sidebar3');
    const formsDiv = document.getElementById('forms');
    const forms = document.querySelectorAll("div[id^='modal']");
    const FormProduct = document.getElementById('FormProduct');
    const FormCateg = document.getElementById('FormCateg');
    const FormMark = document.getElementById('FormMark');
    const FormProve = document.getElementById('FormProve');
    const FormLocal = document.getElementById('FormLocal');
    const FormUser = document.getElementById('FormUser');
    const mainContent = document.getElementById('mainContent');
    const main = document.getElementById('main');
    // Div Views---------------------------------------------
        const div1 = document.getElementById('mainContent')
        const div2 = document.getElementById('ViewModifyre')
        const div3 = document.getElementById('viewInOutStock')
        const div4 = document.getElementById('viewStock')
        const div5 = document.getElementById('viewMovementsInOut')
    // ------------------------------------------------------
    const HomeIcon = document.getElementById('HomeIcon');
    const AceptEdit = document.getElementById('AceptEdit');
    const CancelEdit = document.getElementById('CancelEdit');
    const EditModal = document.getElementById('EditModal');
    const modifyre = document.getElementById('ViewModifyre');
    const divListModifyre = document.getElementById('MainListModify');
    const logo = document.getElementById('Logo');
    const plusBtn = document.getElementById('plusBtn');
    const restBtn = document.getElementById('restBtn');
    const counterViewInput = document.getElementById('inputCounter')
    const confirmaddItembutton = document.getElementById('confirmaddItembutton')
    const SendDataStockBTN = document.getElementById('SendDataStockBTN')
    const CancelDataStockBTN = document.getElementById('CancelDataStockBTN')
    const IngresoBTN = document.getElementById('IngresoBTN')
    const EgresoBTN = document.getElementById('EgresoBTN')
    const previewInOut = document.getElementById('previewInOut')
    const btnsDelete = document.querySelectorAll('.delete');

    let amountbyItem = 0;
    let outArray = [];

    function cleanDIV(div) {
        div.innerHTML = ' ';
    }
    
    logo.addEventListener('click', (e) => {
        formsDiv.classList.add('hidden');
        
        div2.classList.add('hidden')
        div3.classList.add('hidden')
        div4.classList.add('hidden')
        div5.classList.add('hidden')
        main.classList.remove('SideBarColor')
        if (main.classList.contains('hidden')) {
            main.classList.remove('hidden');
        };
        mainContent.classList.remove('hidden');
    } )

    HomeIcon.addEventListener('click', (e) => {
        main.removeChild(modifyre);
        main.classList.remove('SideBarColor')
        modifyre.classList.add('hidden');
        mainContent.classList.remove('hidden');
    })

    function showDivinSidebar(divtoShow) {
        div1.classList.add('hidden')
        div2.classList.add('hidden')
        div3.classList.add('hidden')
        div4.classList.add('hidden')
        div5.classList.add('hidden')
        divtoShow.classList.remove('hidden')
        main.classList.add('SideBarColor')
    }

    async function showEditViewFor(Modaltoshow) {
        try {
            const divList = document.getElementById('MainListModify');
            divList.innerHTML = ' '; // Limpia el contenido de divList
    
            let endpoint;
    
            switch (Modaltoshow) {
                case 'ProductosEdition':
                    endpoint = 'Productos';
                    break;
                case 'ProveedoresEdition':
                    endpoint = 'Provedores';
                    break;
                case 'MarcasEdition':
                    endpoint = 'Marcas';
                    break;
                case 'CategoriasEdition':
                    endpoint = 'Categorias';
                    break;
                case 'LocalesEdition':
                    endpoint = 'Locales';
                    break;
                case 'UsersEdition':
                    endpoint = 'Usuarios';
                    break;
                default:
                    throw new Error('Modaltoshow no válido');
            }
    
            const data = await getData(endpoint);
            createUlModifyre(data, endpoint);
            deleteItems()
            editItems()
    
        } catch (error) {
            console.log(error);
        }
    }
    
    // Sidebar CONTROL
    sidebar.addEventListener('click', function(e) {
        if (e.target.tagName === "LI") {
            const divId = e.target.getAttribute("id").replace("btn", "view");
            const ShowViewdiv = document.getElementById(divId);
            if (ShowViewdiv) {
                showDivinSidebar(ShowViewdiv);
            }
            
        }
    })

    // Sidebar EDICION
    sidebar2.addEventListener('click', function(e) {
        if (e.target.tagName === "LI") {
            console.log('click')
            const ModalChoose = e.target.getAttribute("id")
            console.log(ModalChoose)
            showDivinSidebar(div2);// Show ViewModfyre
            showEditViewFor(ModalChoose) // Call Manage View function for  edit

        }
    })

    // Sidebar Cerrar Sesion
    sidebar3.addEventListener('click', function(e) {
        if (e.target.tagName === "LI") {
            console.log('Cerrando Sesion')
            confirm('Seguro Quiere Cerrar Sesion')
        }
    })

    CancelEdit.addEventListener('click', (e)=> {
        e.preventDefault;
        main.classList.remove('hidden');
        EditModal.classList.add('hidden');
        e.stopPropagation();
    })
    AceptEdit.addEventListener('click', (e) => {
        const form = document.getElementById('EditFormModal');
        const idToEdit = document.querySelector('.idToEdit').textContent;
        const routeToEdit = document.querySelector('.routeToEdit').textContent;
        const route = `${routeToEdit}/${idToEdit}`;
    
        form.addEventListener('submit', (e)=> { 
            e.preventDefault();
            const formData = new FormData(form);
            const ItemModify = Object.fromEntries(formData.entries())
            uptadeManager(route, ItemModify)
        })
    })
    plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const counterViewInput = document.getElementById('inputCounter')
        const counterViewNumber = document.getElementById('counterNumber')
        amountbyItem++;
        counterViewInput.value = amountbyItem;
        counterViewNumber.innerText = amountbyItem;
    })
    restBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const counterViewInput = document.getElementById('inputCounter')
        const counterViewNumber = document.getElementById('counterNumber')
        counterViewInput.value = amountbyItem;
        counterViewNumber.innerText = amountbyItem;
        if (amountbyItem > 0){
            amountbyItem--;
        }
    })
    counterViewInput.addEventListener('input', (e) => {
        const counterViewNumber = document.getElementById('counterNumber');
        const newValue = parseInt(e.target.value);
        if (!isNaN(newValue)) {
            amountbyItem = newValue;
        }
        counterViewNumber.innerText = amountbyItem;
    });
    
    // Agregando cantidad de productos para Enviar a la DB
    confirmaddItembutton.addEventListener('click', (e) => {
        e.preventDefault();
        const titleItemSelected = document.getElementById('ChoiseSpanTitle').getAttribute('data-value');
        const idItemSelected = document.getElementById('ChoiseSpanId').getAttribute('data-value');
        const counter = parseInt(document.getElementById('inputCounter').value); // Convierte la cantidad a número
        const tablePreview = document.getElementById('tablePreviewTransactions');
        const LocalID = document.getElementById('LocalID').value;
        const UserNAME = document.getElementById('UserNAME').value;
        const rows = tablePreview.getElementsByTagName('tr'); 
    
        // Busca si ya existe un elemento con el mismo id_Producto
        const existingItemIndex = outArray.findIndex(item => item.Product_ID === idItemSelected);
    
        if (existingItemIndex !== -1) {
            // Si existe, actualiza la cantidad
            outArray[existingItemIndex].cantidad += counter;
        } else {
            // Si no existe, crea un nuevo objeto
            if (counter > 0 && titleItemSelected.trim() !== "" && idItemSelected.trim() !== "") {
                const newItem = {
                    nombre: titleItemSelected,
                    Product_ID: idItemSelected,
                    cantidad: counter,
                    Local: LocalID,
                    Usuario : UserNAME
                };
                outArray.push(newItem);
            }
        }
        // Limpia la tabla antes de volver a mostrar los elementos
        tablePreview.innerHTML = "";
        // Recorre el array y muestra los elementos en la tabla
        outArray.forEach((item) => {
            const trTableView = document.createElement('tr');
            const tdTitleTableView = document.createElement('td');
            const tdIDTableView = document.createElement('td');
            const tdAmountTableView = document.createElement('td');
            const tdDeleteIcon = document.createElement('td');
            const deleteIcon = document.createElement('button');
            deleteIcon.innerHTML = "&#10006;";

            deleteIcon.addEventListener('click', () => {
                // Encuentra el índice del elemento a eliminar en el array
                const existingItemIndex = outArray.findIndex(item => item.Product_ID === idItemSelected);

                if (existingItemIndex !== -1) {
                    // Elimina el elemento del array
                    outArray.splice(existingItemIndex, 1);
                    // Elimina la fila de la tabla
                    tablePreview.removeChild(trTableView);
                }
            });

            trTableView.appendChild(tdTitleTableView);
            trTableView.appendChild(tdIDTableView);
            trTableView.appendChild(tdAmountTableView);
            trTableView.appendChild(tdDeleteIcon);
            tablePreview.appendChild(trTableView);
            tdDeleteIcon.appendChild(deleteIcon);
           
            tdTitleTableView.innerText = item.nombre;
            tdIDTableView.innerText = item.Product_ID;
            tdAmountTableView.innerText = item.cantidad;
        });
        console.log(outArray);
    });
    //Confirmar el envio del Stock al local corrspondiente
    /*SendDataStockBTN.addEventListener('click', (e) => {
        if (outArray.length === 0) {
            alert('NO HAY ELEMENTOS para enviar');
            return; // Detiene la ejecución si el array está vacío
        }
    
        // Preguntar al usuario antes de enviar
        const confirmarEnvio = confirm('¿Deseas enviar los datos?');
        
        if (confirmarEnvio) {
            const sendDataStock = JSON.stringify(outArray);
            const url = 'http://localhost:3000/Stock';
    
                const requestOptions = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json',},
                    body: sendDataStock,
                };
            // Realiza la solicitud POST
            fetch(url, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert('Datos enviados con éxito')
                        console.log('Datos enviados con éxito');
                    } else {
                        console.error('Error al enviar datos');
                    }
                })
                .catch(error => {
                    console.error('Error de red:', error);
                });
        }
    })*/

    SendDataStockBTN.addEventListener('click', async (e) => {
        if (outArray.length === 0) {
            alert('NO HAY ELEMENTOS para enviar');
            return; // Detiene la ejecución si el array está vacío
        }
    
        // Preguntar al usuario antes de enviar
        const confirmarEnvio = confirm('¿Deseas enviar los datos?');
    
        if (confirmarEnvio) {
            for (const item of outArray) {
                const sendDataStock = JSON.stringify(item);
                const url = 'http://localhost:3000/Stock';
    
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: sendDataStock,
                };
    
                try {
                    const response = await fetch(url, requestOptions);
                    if (response.ok) {
                        alert('Datos enviados con éxito para el elemento');
                        console.log('Datos enviados con éxito para el elemento');
                    } else {
                        console.error('Error al enviar datos para el elemento');
                    }
                } catch (error) {
                    console.error('Error de red:', error);
                }
            }
    
            // Una vez que se han enviado todos los elementos, vacía el array
            outArray = [];
    
            // Limpia la tabla o realiza cualquier otra acción necesaria
            // para reflejar que los elementos se han enviado y vaciado.
        }
    });
    IngresoBTN.addEventListener('click', (e) => {
        const divUP = document.getElementById('avaliableItems')
        const divEl = document.getElementById('avaliableItemsList')
        const spanTitle = document.getElementById('ChoiseSpanTitle')
        const spanId = document.getElementById('ChoiseSpanId')
            if (previewInOut.classList.contains('EgresoView') && EgresoBTN.classList.contains('glowEffect2')){
                previewInOut.classList.remove('EgresoView')
                EgresoBTN.classList.remove('glowEffect2')
            }
            if (spanTitle.classList.contains('borderSpan2') && spanId.classList.contains('borderSpan2')) {
                spanTitle.classList.remove('borderSpan2')
                spanId.classList.remove('borderSpan2')
                spanTitle.classList.add('borderSpan1')
                spanId.classList.add('borderSpan1')
            }
        previewInOut.classList.add('IngresoView')
        IngresoBTN.classList.add('glowEffect2')
        confirmaddItembutton.innerText = ""
        confirmaddItembutton.innerText = "Agregar Cantidad"
        if (divEl.classList.contains('hidden')){
           // cleanDIV(divUP)
            divEl.classList.remove('hidden')
        }
    })
    EgresoBTN.addEventListener('click', (e) => {
        const divUP = document.getElementById('avaliableItems')
        const divEl = document.getElementById('avaliableItemsList')
        const spanTitle = document.getElementById('ChoiseSpanTitle')
        const spanId = document.getElementById('ChoiseSpanId')
            if (previewInOut.classList.contains('IngresoView') && IngresoBTN.classList.contains('glowEffect2')){
                previewInOut.classList.remove('IngresoView')
                IngresoBTN.classList.remove('glowEffect2')
            }
            if (spanTitle.classList.contains('borderSpan1') && spanId.classList.contains('borderSpan1')) {
                spanTitle.classList.remove('borderSpan1')
                spanId.classList.remove('borderSpan1')
                spanTitle.classList.add('borderSpan2')
                spanId.classList.add('borderSpan2')
            }
        previewInOut.classList.add('EgresoView')
        EgresoBTN.classList.add('glowEffect2')
        confirmaddItembutton.innerText = ""
        confirmaddItembutton.innerText = "Quitar Cantidad"

        divEl.classList.add('hidden')
    })

    //  
    function uptadeManager(route, dataJson) {
        updateMethod(route, dataJson)
    }

    // Mostrar un formulario y ocultar los demás
    function showForm(form) {
        forms.forEach(form => {
            form.classList.add("hidden");
        });
        formsDiv.classList.remove('hidden');
        form.classList.remove("hidden");
        formsDiv.classList.add('overflow-modal');
        if (!main.classList.contains('hidden')) {
            main.classList.add('hidden');
        };
    }
    // Asociar evento al menú de navegación
    nav.addEventListener("click", function (e) {
        if (e.target.tagName === "BUTTON") {
            const formId = e.target.getAttribute("id").replace("btn", "modal");
            const formulario = document.getElementById(formId);
            if (formulario) {
                showForm(formulario);
            }
        }
    });

    // funcion para en enviar data de Form
    const newDataSend = (formx, route) => {
        formx.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(e.target);
            const completeData = Object.fromEntries(data.entries());
            //console.log(completeData)
            postMethod(completeData, route);
            formx.reset();// Reseteo el Form despues del Submit
            
        })
        
    }

    //  Metodo POST
    const postMethod = async (objetData, route) => {
        const newPost =  objetData;
        //console.log(newPost)
        try {
            const response = await fetch(`http://localhost:3000/${route}`, {
                method :'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(newPost)
            })

        } catch (error) {
            console.log(error);
        }
    }
    // Metodo DELETE
    async function deleteMethod(route){
        try {
            const response = await fetch(`http://localhost:3000/${route}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json' }             
            });
    
            if (response.status === 204) {
                // La solicitud DELETE se completó con éxito
                console.log("Eliminado con éxito");
            } else {
                console.error("Error al eliminar");
            }
        } catch (error) {
            console.error(error);
        }
    };
     // Metodo UPDATE
    const updateMethod = async (route, data) => {
        try {
            const response = await fetch(`http://localhost:3000/${route}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data) 
            });
    
            if (response.status === 200) {
                console.log("Actualizado con éxito");
            } else {
                console.error("Error al actualizar");
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    // Función para cargar y mostrar los datos
    function showDataTable(jsonData, divId, tableId) {
        const divTable = document.getElementById(`${divId}`);
        const table = document.getElementById(`${tableId}`);
        
        // Recorre el JSON y crea filas en la tabla
            jsonData.forEach((entidad) => {
                const fila = document.createElement("tr");

                // Crea celdas para cada propiedad
                for (const key in entidad) {
                    if (key !== "id") { // Excluye la columna "id"
                        const row = document.createElement("td");
                        row.textContent = entidad[key];
                        fila.appendChild(row);
                    }
                }
                table.appendChild(fila);
                //tbody.appendChild(fila);
            });

        divTable.appendChild(table);
    }
    
    // funcion que crea una lista dinamica y muestra su contenido
    function showDataList(arr, classList) {
        const list = document.querySelector(`.${classList}`);
        // Verifica si se encontró el elemento de la lista
        if (!list) {
            console.error('No se encontró el elemento de la lista.');
            return;
        }
        // Recorre el array de objetos
        arr.forEach((marca) => {
            // Crea un elemento de lista (li)
            const listItem = document.createElement("li");
            // uso de Object.keys para acceder al 1er elem. del array
            const keys = Object.keys(marca);
            const firstKey = keys[0];
            listItem.textContent = marca[firstKey]; 
            list.appendChild(listItem);
        });
    }
    // Crear Ul por cada json para Borrar y Editar
    function createUlModifyre(arr, nameTitle) {
        const Title = document.getElementById('titleModify')
        const spanTitle = document.getElementById('spanModify')
        const count = document.getElementById('CountModify')//

        const ulEl = document.createElement('ul');
        ulEl.classList.add('ulModify')
        arr.forEach((Item) => {
            // Create Elements
            const liEl = document.createElement('li');
            const divEl = document.createElement('div');
            const divTitle = document.createElement('div');
            const divbtns = document.createElement('div');
            const pName = document.createElement('p');
            const pID = document.createElement('p');
            const btnborrar = document.createElement('button');
            const btnEdit = document.createElement('button');
            
            // Get Values to elements
            const keys = Object.keys(Item);
            const firstKey = keys[0];
            pName.innerText = Item[firstKey];
            for (const key in Item) {
                if (key === "id") { 
                    pID.innerText = Item[key];
                    btnborrar.value = Item[key];
                    btnEdit.value = Item[key];
                }
            }
            btnborrar.innerText = 'Borrar'; 
            btnEdit.innerText = 'Editar';
            btnborrar.setAttribute('array-name', nameTitle);
            btnEdit.setAttribute('array-name', nameTitle);
            ulEl.setAttribute('view-modify', nameTitle)
            
            // Assigned classes 
            divEl.classList.add('ItemModify');
            divTitle.classList.add('ItemId');
            divbtns.classList.add('btnsItems');
            btnborrar.classList.add('btnDeleteM');
            btnEdit.classList.add('btnEditM');
            
             // Create final component
            divTitle.appendChild(pName)
            divTitle.appendChild(pID)
            divbtns.appendChild(btnborrar)
            divbtns.appendChild(btnEdit)
            divEl.appendChild(divTitle)
            divEl.appendChild(divbtns)
            liEl.appendChild(divEl)
            ulEl.appendChild(liEl)
        })
        MainListModify.appendChild(ulEl)
        const showCount = arr.length;
        count.innerText = showCount;
        Title.innerText = nameTitle;
        spanTitle.innerText = nameTitle;
        
    }
    // Funcion Dinamica para el editar
    async function showModalEdit(id, nameArr){
        try {
            main.classList.add('hidden');
            EditModal.classList.remove('hidden');
            // 
            const itemData = await getData(`${nameArr}/${id}`);
            const divEdit = document.getElementById('EditItemsDiv');
            divEdit.innerHTML = ''; // Limpiar cualquier contenido previo 
            const divPreview = document.getElementById('EditPreviewItem');
            divPreview.innerHTML =''; // Clean previus content
            const titleH3 = document.createElement('h3');
            const pIdToEdit = document.createElement('p');
            const pIdLabel = document.createElement('p');
            const divIdToEdit = document.createElement('div');
            titleH3.innerText = nameArr;
            pIdToEdit.innerText = id;
            pIdLabel.innerText = `${nameArr} #ID: `
            divEdit.appendChild(titleH3);
          
            // create inputs foreach key 
            for (const key in itemData ) {
                if (key !== "id") {
                    const inputEl = document.createElement('input');
                    inputEl.setAttribute('placeholder', key);
                    inputEl.setAttribute('name', key);
                    divEdit.appendChild(inputEl);
                }
            }
            // create table for preview item for edit
            const table = document.createElement("table");
            for (const key in itemData) {
                if (key !== "id") {   
                    const column = document.createElement("tr");
                    const clave = document.createElement("td");
                    const valor = document.createElement("td");
                    clave.textContent = key;
                    valor.textContent = itemData[key];
                    column.appendChild(clave);
                    column.appendChild(valor);
                    table.appendChild(column);
                }
            }
            divIdToEdit.appendChild(pIdLabel)
            divIdToEdit.appendChild(pIdToEdit)
            divPreview.appendChild(divIdToEdit)
            divIdToEdit.classList.add('infoIdEdit')
            pIdToEdit.classList.add('idToEdit')
            titleH3.classList.add('routeToEdit')
            divPreview.appendChild(table)
            divPreview.appendChild(divIdToEdit)
        } 
        catch (error) {
            console.log(error);
        }
    }

    // Agrega Funcionalidad a los btn Borrar
    function deleteItems() {
        const botonesDelete = document.querySelectorAll(".btnDeleteM");
        botonesDelete.forEach(boton => {
            boton.addEventListener('click', (e) => {
                e.preventDefault();
                const id = boton.value;
                const arrayName = boton.getAttribute("array-name");
                deleteMethod(`${arrayName}/${id}`)
            });
        });
    }
    // Agrega Funcionalidad a los btn Edit
    function editItems(){
        const botonesEdit = document.querySelectorAll(".btnEditM");
        botonesEdit.forEach(boton => {
            boton.addEventListener('click', (e) => {
                e.preventDefault();
                const id = boton.value;
                const arrayName = boton.getAttribute("array-name");
                showModalEdit(id, arrayName)
            });
        });
    }

    // Agregar datos a la vista Entrada y Salida
    async function callItemAvaliable(){
        try {
            const divEl = document.getElementById('avaliableItemsList')
            const spanTitle = document.getElementById('ChoiseSpanTitle')
            const spanId = document.getElementById('ChoiseSpanId')
            // GET Procucts
            const getDataItems = await getData('Productos')
            getDataItems.forEach(((item ) => {
                const keys = Object.keys(item);
                const firstKey = keys[0];
                const divRow = document.createElement('div')
                const NameItem = document.createElement('p')
                const idItem = document.createElement('p')
                NameItem.textContent = item[firstKey];
                for (const key in item) {
                    if (key === "id") { 
                        idItem.innerText = item[key];
                    }
                }
                divRow.classList.add('avaliableItemsRow')
                divRow.appendChild(NameItem)
                divRow.appendChild(idItem)
                divEl.appendChild(divRow)

                divRow.addEventListener('click', (e) => {
                    if (!divRow.classList.contains('glowEffect')){
                        e.preventDefault();
                        divRow.classList.add('glowEffect')
                    }
                    spanTitle.innerText = '';
                    spanId.innerText = '';
                    spanTitle.innerText = NameItem.innerText;
                    spanId.innerText = idItem.innerText;
                    spanTitle.setAttribute('data-value', NameItem.innerText);
                    spanId.setAttribute('data-value', idItem.innerText);
                    e.stopPropagation();
                });
            }))
        } catch (error) {
            console.log(error)
        }
    }
    async function categorysAvaliable() {
        try {
            const divEl = document.getElementById('StockCategory');
            // GET Categorias
            const getDataItems = await getData('Categorias');
            console.log(getDataItems);
            const ul = document.createElement('ul');
            getDataItems.forEach((item) => {
                const li = document.createElement('li');
                li.innerText = item.Categoria;
                ul.appendChild(li);
            });
            divEl.appendChild(ul);
        } catch (error) {
            console.log(error);
        }
    }
    
    // Función para crear y agregar una lista desde un JSON a un div
    async function addItemFromJSON() {
        const divEl = document.getElementById('stockList');
        const jsonData = await getData('Stock');
        
        // Crear la lista ul
        const ul = document.createElement('ul');
        ul.classList.add('UlStockList');

        // Recorrer el JSON y agregar elementos a la lista
        jsonData.forEach(item => {
            // Extraer datos del objeto JSON
            const { id, nombre, Local, Usuario, cantidad } = item;

            // Crear un nuevo elemento de lista (li)
            const li = document.createElement('li');

            // Crear la estructura de nombres, ID, local y usuario
            const divNameIDStock = document.createElement('div');
            divNameIDStock.classList.add('NameIDStock');
            const pID = document.createElement('p');
            pID.textContent = `#${id}`;
            const pNombre = document.createElement('p');
            pNombre.textContent = nombre;
            const pLocal = document.createElement('p');
            pLocal.textContent = Local;
            const pUsuario = document.createElement('p');
            pUsuario.textContent = Usuario;

            // Agregar los elementos de nombres, ID, local y usuario al div correspondiente
            divNameIDStock.appendChild(pID);
            divNameIDStock.appendChild(pNombre);
            divNameIDStock.appendChild(pLocal);
            divNameIDStock.appendChild(pUsuario);

            // Crear la estructura de precio y cantidad
            const divPriceAmountStock = document.createElement('div');
            divPriceAmountStock.classList.add('PriceAmountStock');
            const pPrecio = document.createElement('p'); // Precio no está presente en el JSON
            pPrecio.textContent = 'Precio'; // Puedes agregar el precio aquí si es necesario
            const pCantidad = document.createElement('p');
            pCantidad.textContent = `Cantidad: ${cantidad}`;

            // Agregar los elementos de precio y cantidad al div correspondiente
            divPriceAmountStock.appendChild(pPrecio);
            divPriceAmountStock.appendChild(pCantidad);

            // Agregar los divs de nombre/ID/local/usuario y precio/cantidad al elemento li
            li.appendChild(divNameIDStock);
            li.appendChild(divPriceAmountStock);

            // Agregar el elemento li a la lista ul
            ul.appendChild(li);
        });

        // Agregar la lista ul al div con id "stockList"
        divEl.appendChild(ul);
    }

    
    // Metodo GET - Dinamico 
    async function getData(route){
        try {
            const response = await fetch(`http://localhost:3000/${route}`);
        
            if (!response.ok) {
                throw new Error('No se pudo obtener la información.');
            }
            const jsonData = await response.json();
            return jsonData;
        }
        catch (error) {
            console.log(error);
        }
    }

    //injeta un option en un select - recibe un array y un ID del dropdawn
    const injertToDropdown = (data, selectId) => {
        const select = document.getElementById(`${selectId}`)
        const datos = data;
        
        datos.forEach((dato) => {
                const option = document.createElement("option");
                const keys = Object.keys(dato);
                const firstKey = keys[0];
                option.textContent = dato[firstKey]; // seteo el texto que se va ver
                const idOption = dato["id"]; // obtengo el id del option
                //option.value = idOption ; // seteo el value con el Id del JSON
                option.value = dato[firstKey];
                select.appendChild(option);
            }
        ) 
    }

    // Funcion que trae una vista de previa de las Entidades
    async function getMultiData() {
        try {

            const getInit = await getData('Productos'); // obtengo datos 
            showDataTable(getInit, 'productTable', 'tableInit'); // view en Dashboard
            callItemAvaliable();
            
            const getProductos = await getData('Productos');
            showDataTable(getProductos, 'previewProduct', 'tableProducts');
           
            const getProvedor = await getData('Provedores');
            showDataTable(getProvedor, 'previewProve', 'tableProve');
            injertToDropdown(getProvedor, 'Provedor');

            const getMarca = await getData('Marcas');
            showDataList(getMarca,'MarkList');    
            injertToDropdown(getMarca, 'Marca');

            const getCategoria = await getData('Categorias');
            showDataList(getCategoria, 'CategoryList');
            injertToDropdown(getCategoria, 'Categoria');
            categorysAvaliable()
          
            const getLocales = await getData('Locales');
            showDataTable(getLocales, 'previewLocales', 'tableLocales');
            injertToDropdown(getLocales, 'LocalID')
            injertToDropdown(getLocales, 'StockSelects')
            injertToDropdown(getLocales, 'StockSelectsMove')
            injertToDropdown(getLocales, 'sentoToLocal')
            
            const getUsuarios = await getData('Usuarios');
            showDataTable(getUsuarios, 'previewUsers', 'tableUsers');
            injertToDropdown(getUsuarios, 'UserNAME')
            
            addItemFromJSON()
        } catch (error) {
            console.log(error)
        }
    }
    // Llamada a la funcion asyncrona que trae datos
    getMultiData();

    // Llamado a la funcion de Envio de data de los Forms - POST Method
    // Fromulario / ruta
    newDataSend(FormProduct, 'Productos');
    newDataSend(FormCateg, 'Categorias');
    newDataSend(FormMark, 'Marcas');
    newDataSend(FormProve,'Provedores');
    newDataSend(FormLocal,'Locales');
    newDataSend(FormUser, 'Usuarios');
});




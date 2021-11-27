window.onload = async function(){

    const formReportBookingsBeetwenDates = document.querySelector("#form_report_bookings_date_range");
    const bookingsProportionPanel = document.querySelector("#panel_output_proportion_bookings");
    const tableTopClients = document.querySelector("#top_clients_table");

    // FUNCTION FOR GET BOOKINGS BETWEEN TWO DATES LIKE ARGS
    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    async function bookingsBetweenDateRange(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const table = document.querySelector(".table_body");
        const dateStart = e.target.booking_start_date.value;
        const dateEnd = e.target.booking_finish_date.value;

        if(new Date(dateStart).getTime() >= (new Date(dateEnd).getTime())){
			alert("La fecha de inicio no puede ser despues o igual a la fecha de finalizacion");
			return;
		}
        
        const response = await fetch(`http://http://150.230.92.110/:8080/api/Reservation/report-dates/${dateStart}/${dateEnd}`);
        const data = await response.json();
        updateTable(await data, table, formatRowTable);
        
        function formatRowTable(data){
            return `
            <tr>
            <td class="columna-id-tabla-bookings column_id">${data.idReservation}</td>
            <td class="columna-start_time-tabla-bookings">${(data.startDate).split("T")[0] /*+ " " + data.startDate.split(":00.")[0].split("T")[1]*/}</td>
            <td class="columna-finish_time-tabla-bookings">${(data.devolutionDate).split("T")[0] /*+ " " + data.devolutionDate.split(":00.")[0].split("T")[1]*/}</td>
            <td class="columna-partyroom-tabla-bookings">${data.partyroom.name}</td>
            <td class="columna-client-tabla-bookings">${data.client.name}</td>
            <td class="columna-status-tabla-bookings">${data.status}</td>
            </tr>
            `
        }
    }
    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    formReportBookingsBeetwenDates? formReportBookingsBeetwenDates.addEventListener("submit", bookingsBetweenDateRange) : "";
        
    // FUNCTION FOR GET BOOKINGS COMPLETED AND CANCELLED
    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    async function getBookingsProportion(){
        const bookingsCompleted = bookingsProportionPanel.querySelector("#bookings_completed");
        const bookingsCancelled = bookingsProportionPanel.querySelector("#bookings_cancelled");
        const bookingsTotal = bookingsProportionPanel.querySelector("#bookings_total");
        
        const response = await fetch("http://http://150.230.92.110/:8080/api/Reservation/report-status");
        const data = await response.json();
        
        if(await data != null){
            bookingsCompleted.innerHTML = data.completed;
            bookingsCancelled.innerHTML = data.cancelled;
            bookingsTotal.innerHTML = parseInt(data.completed) + parseInt(data.cancelled);
        }
    }
    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    bookingsProportionPanel? getBookingsProportion() : "";
    
    // FUNCTION FOR GET RANKING CLIENTS IN BASE TO UMBER OF BOOKINGS
    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    async function getBookingsForClient(){
        
        const table = tableTopClients.querySelector(".table_body");
        
        const response = await fetch(`http://http://150.230.92.110/:8080/api/Reservation/report-clients`);
        const data = await response.json();
        console.log(await data);
        updateTable(await data, table, formatRowTable);

        function formatRowTable(data){
            return `
            <tr>
                <td class="columna-id-tabla-clientes column_id">${data.client.idClient}</td>
                <td class="columna-name-tabla-clientes">${data.client.name}</td>
                <td class="columna-email-tabla-clientes">${data.client.email}</td>
                <td class="columna-bookings-tabla-clientes">${data.total}</td>
            </tr>
            `
        }
    }
    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    tableTopClients? getBookingsForClient() : "";



    async function updateTable(data, table, formatRowTable){
        if(Symbol.iterator in Object(data) && data.length > 0){
            document.querySelector(".without_results").style.display = "none";
            table.innerHTML = "";
            for(var obj of await data){
                table.innerHTML += formatRowTable(obj);
            }
        }else{
            table.innerHTML = ""
            document.querySelector(".without_results").style.display = "block";
        }
    }

    
}
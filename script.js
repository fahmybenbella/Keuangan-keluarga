function calculateAllocations(input){
    const row=input.parentElement.parentElement;
    const amount=parseFloat(input.value)||0;

    const tabungan=amount*0.5;
    const belanja=amount*0.15;
    const sekolah=amount*0.15;
    const kesehatan=amount*0.10;
    const gaji=amount*0.10;

    row.querySelector('.tabungan').textContent=formatCurrency(tabungan);
    row.querySelector('.belanja').textContent=formatCurrency(belanja);
    row.querySelector('.sekolah').textContent=formatCurrency(sekolah);
    row.querySelector('.kesehatan').textContent=formatCurrency(kesehatan);
    row.querySelector('.gaji').textContent=formatCurrency(gaji);

    updateTotals();
}

function addNewRow(){
    const tbody=document.querySelector('#financial-table tbody');
    const newRow=document.createElement('tr');
    newRow.innerHTML=`
        <td><input type="date" class="date-input"></td>
        <td><input type="number" class="amount-input" min="0" oninput="calculateAllocations(this)"></td>
        <td class="tabungan">0</td>
        <td class="belanja">0</td>
        <td class="sekolah">0</td>
        <td class="kesehatan">0</td>
        <td class="gaji">0</td>`;
    tbody.appendChild(newRow);
}

function updateTotals(){
    let totalAmount=0,totalTabungan=0,totalBelanja=0,totalSekolah=0,totalKesehatan=0,totalGaji=0;
    document.querySelectorAll('#financial-table tbody tr').forEach(row=>{
        const amount=parseFloat(row.querySelector('.amount-input').value)||0;
        totalAmount+=amount;
        totalTabungan+=amount*0.5;
        totalBelanja+=amount*0.15;
        totalSekolah+=amount*0.15;
        totalKesehatan+=amount*0.10;
        totalGaji+=amount*0.10;
    });
    document.getElementById('total-amount').textContent=formatCurrency(totalAmount);
    document.getElementById('total-tabungan').textContent=formatCurrency(totalTabungan);
    document.getElementById('total-belanja').textContent=formatCurrency(totalBelanja);
    document.getElementById('total-sekolah').textContent=formatCurrency(totalSekolah);
    document.getElementById('total-kesehatan').textContent=formatCurrency(totalKesehatan);
    document.getElementById('total-gaji').textContent=formatCurrency(totalGaji);

    document.getElementById('summary-amount').textContent=formatCurrency(totalAmount,true);
    document.getElementById('summary-tabungan').textContent=formatCurrency(totalTabungan,true);
    document.getElementById('summary-belanja').textContent=formatCurrency(totalBelanja,true);
    document.getElementById('summary-sekolah').textContent=formatCurrency(totalSekolah,true);
    document.getElementById('summary-kesehatan').textContent=formatCurrency(totalKesehatan,true);
    document.getElementById('summary-gaji').textContent=formatCurrency(totalGaji,true);
}

function formatCurrency(amount,withSymbol=false){
    if(isNaN(amount))amount=0;
    const formatted=new Intl.NumberFormat('id-ID').format(amount);
    return withSymbol?'Rp '+formatted:formatted;
}

function exportToExcel(){
    const wb=XLSX.utils.book_new();
    wb.SheetNames.push("Keuangan");
    const table=document.getElementById('financial-table');
    const data=[];
    const headers=table.querySelectorAll('thead th');
    data.push(Array.from(headers).map(h=>h.textContent));
    table.querySelectorAll('tbody tr').forEach(row=>{
        const inputs=row.querySelectorAll('input');
        const cells=row.querySelectorAll('td:not(:first-child)');
        const rowData=[inputs[0].value, parseFloat(inputs[1].value)||0];
        cells.forEach(c=>{
            const value=c.textContent.replace(/\./g,'');
            rowData.push(parseFloat(value)||0);
        });
        data.push(rowData);
    });
    const totals=table.querySelectorAll('tfoot td:not(:first-child)');
    data.push(['Total', ...Array.from(totals).map(c=>parseFloat(c.textContent.replace(/\./g,''))||0)]);
    const ws=XLSX.utils.aoa_to_sheet(data);
    wb.Sheets["Keuangan"]=ws;
    XLSX.writeFile(wb,"Laporan_Keuangan.xlsx");
}

function resetTable(){
    if(!confirm('Apakah Anda yakin ingin mereset tabel? Semua data akan dihapus.')) return;
    const tbody=document.querySelector('#financial-table tbody');
    tbody.innerHTML=`
        <tr>
            <td><input type="date" class="date-input"></td>
            <td><input type="number" class="amount-input" min="0" oninput="calculateAllocations(this)"></td>
            <td class="tabungan">0</td>
            <td class="belanja">0</td>
            <td class="sekolah">0</td>
            <td class="kesehatan">0</td>
            <td class="gaji">0</td>
        </tr>`;
    updateTotals();
}

function kirimWhatsApp(){
    const date=document.querySelector('.date-input').value;
    const totalAmount=document.getElementById('summary-amount').textContent;
    const tabungan=document.getElementById('summary-tabungan').textContent;
    const belanja=document.getElementById('summary-belanja').textContent;
    const sekolah=document.getElementById('summary-sekolah').textContent;
    const kesehatan=document.getElementById('summary-kesehatan').textContent;
    const gaji=document.getElementById('summary-gaji').textContent;

    let pesan=`Hasil Perhitungan Keuangan Pribadi:\nTanggal: ${date}\nTotal Pemasukan: ${totalAmount}\nTabungan (50%): ${tabungan}\nBelanja (15%): ${belanja}\nSekolah (15%): ${sekolah}\nKesehatan (10%): ${kesehatan}\nGaji (10%): ${gaji}`;
    const waURL=`https://wa.me/?text=${encodeURIComponent(pesan)}`;
    window.open(waURL,'_blank');
}

document.addEventListener('DOMContentLoaded',function(){
    const today=new Date().toISOString().substr(0,10);
    document.querySelector('.date-input').value=today;
});
function outbound() {
  const getItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/items');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseJson = await response.json();

      if (responseJson.status === 'success') {
        return responseJson.data.items;
      } else {
        showResponseMessage('Failed to retrieve item details');
        return []; // Mengembalikan array kosong jika gagal
      }
    } catch (error) {
      showResponseMessage(error.message || 'Check your internet connection');
      return []; // Mengembalikan array kosong jika terjadi error
    }
  };

  const outboundItem = async (itemDetail) => {
    try {
      const storageLocation = itemDetail.storage_location;
      const response = await fetch('http://localhost:5000/robot/sendOutboundTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storageLocation }),
      });

      console.log(itemDetail);

      const responseJson = await response.json();

      if (responseJson.status === 'OK') {
        editStock(itemDetail);
      } else {
        showResponseMessage('Failed to retrieve item details');
      }
    } catch (error) {
      showResponseMessage(error.message || 'Check your internet connection');
    }
  };

  const editStock = async (itemDetail) => {
    try {
      const response = await fetch('http://localhost:5000/items', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemDetail }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseJson = await response.json();

      if (responseJson.status === 'success') {
        showResponseMessage('Update Success');
        renderOutboundPage(); // Refresh halaman setelah update
      } else {
        showResponseMessage('Failed to update item details');
      }
    } catch (error) {
      showResponseMessage(error.message || 'Check your internet connection');
    }
  };

  const renderOutboundPage = async () => {
    const items = await getItems();
    document.querySelector('main .container').innerHTML = `
      <h2>Outbound Page</h2>
      <div class="outbound-container">
        <form id="search-form">
          <label for="barcode">Barcode:</label>
          <input type="text" id="barcode" name="barcode" placeholder="Enter Barcode">
          <button type="submit">Search</button>
        </form>
        <div id="stock-details">
          <!-- Stock data will be displayed here -->
          ${generateTableHTML(items)}
        </div>
      </div>
    `;

    items.forEach((item) => {
      document.getElementById(`outbound-${item.barcode}`).addEventListener('click', () => {
        outboundItem(item);
      });
    });

    document.getElementById('search-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const barcode = document.getElementById('barcode').value.trim();
      if (barcode) {
        showResponseMessage('Tunggu Update selanjutnya');
      } else {
        showResponseMessage('Please enter a valid barcode');
      }
    });
  };

  const generateTableHTML = (data) => {
    let stockHTML =
      '<table><tr><th>Barcode</th><th>Item Name</th><th>SKU</th><th>Qty</th><th>Storage Location</th><th>Action</th></tr>';

    if (data.length === 0) {
      stockHTML += `<tr><td colspan="6">No data available</td></tr>`; // Pesan jika tidak ada data
    } else {
      data.forEach((item) => {
        stockHTML += `
          <tr>
            <td>${item.barcode}</td>
            <td>${item.item_name}</td>
            <td>${item.sku}</td>
            <td>${item.qnt}</td>
            <td>${item.storage_location}</td>
            <td><button id="outbound-${item.barcode}">Outbound</button></td>
          </tr>
        `;
      });
    }

    stockHTML += '</table>';
    return stockHTML;
  };

  const showResponseMessage = (message = 'Check your internet connection') => {
    alert(message);
  };

  renderOutboundPage();
}

export default outbound;

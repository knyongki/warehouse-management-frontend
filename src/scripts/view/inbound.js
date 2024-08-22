function inbound() {
  const queryItem = async (barcode) => {
    try {
      const response = await fetch('http://localhost:5000/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseJson = await response.json();

      if (responseJson.status === 'OK') {
        renderDetailItem(responseJson.data);
      } else {
        showResponseMessage('Failed to retrieve item details');
      }
    } catch (error) {
      showResponseMessage(error.message || 'Check your internet connection');
    }
  };

  const inboundItem = async(itemDetail) => {
    try {
      const barcode = itemDetail.barcode;
      const response = await fetch('http://localhost:5000/robot/sendInboundTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode }),
      });

      const responseJson = await response.json();

      if (responseJson.status === 'OK') {
        const item = {
          ...itemDetail,
          storageLocation: responseJson.storageLocation,
        };
        addItem(item);
      } else {
        showResponseMessage('Failed to retrieve item details');
      }

    } catch (error) {
      showResponseMessage(error.message || 'Check your internet connection');
    }
  }

  const addItem = async (item) => {
    try {
      const response = await fetch('http://localhost:5000/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item }),
      });

      const responseJson = await response.json();
      if (responseJson.status === 'success') {
        showResponseMessage('Berhasil Memasukan Item');
      } else {
        showResponseMessage('Failed to retrieve item details');
      }
    } catch (error) {
      showResponseMessage(error.message || 'Check your internet connection');
    }
  };

  const renderInboundPage = () => {
    document.querySelector('main .container').innerHTML = `
      <h2>Inbound Page</h2>
        <div class="inbound-container">
        <form id="inbound-form">
          <label for="barcode">Barcode:</label>
          <input type="text" id="barcode" name="barcode" placeholder="Enter Barcode">
          <button type="submit">Search</button>
        </form>
        <div id="item-details">
          <!-- Detail item akan ditampilkan di sini -->
        </div>
      </div>
    `;

    document.getElementById('inbound-form').addEventListener('submit', (event) => {
      event.preventDefault();
      document.getElementById('item-details').innerHTML = ``;
      const barcode = document.getElementById('barcode').value;
      queryItem(barcode);
    });
  };

  const renderDetailItem = (item) => {
    document.getElementById('item-details').innerHTML = `
      <div>Stock Data</div>
      <div class="detail-info">
        <p>Barcode : ${item.barcode}</p>
        <p>Item Name : ${item.itemName}</p>
        <p>SKU : ${item.SKU}</p>
        <p>Quantity : ${item.qty}</p>
      </div>
      <button id="inbound">Inbound</button>
    `;

    document.getElementById('inbound').addEventListener('click', (event) => {
      event.preventDefault();
      const itemDetail = item;
      inboundItem(itemDetail);
    });
  };

  const showResponseMessage = (message = 'Check your internet connection') => {
    alert(message);
  };

  renderInboundPage();
}

export default inbound;

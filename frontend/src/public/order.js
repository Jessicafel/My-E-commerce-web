
const pastorder= [];
const order = document.getElementById('order');

document.addEventListener('DOMContentLoaded', () => {
    loadorder();
    if (pastorder.length === 0) {
        order.innerHTML = `<section class="content" id="emptymessage">
            <h1 class="empty">You Have No Past Orders</h1>
            <div class="button">
                <a href="Products.html" class="label">Discover Now</a>
            </div>
        </section>`;
    } else {
        pastorder.forEach(history => {
                order.innerHTML += `<div class="header">
                    <h1 class="orderid">Order #${history.orderid}</h1>
                    <h3 class="time">at ${history.date}</h3>
                </div>`;
                let orderHTML='';
                
                const itemCounts = {};
                history.item.forEach(items => {
                  itemCounts[items.id] = (itemCounts[items.id] || 0) + 1;
                });

                Object.keys(itemCounts).forEach(id => {
                    const ordered = history.item.find(i => i.id === Number(id));
                    orderHTML += `<div class="item">
                            <div class="img"><img src="${ordered.img}" class="image"></div>
                            <div class="desc">
                                <div class="nameandtry">
                                ${itemCounts[ordered.id]}
                                    <h3 class="productdes">${ordered.name}</h3>
                                </div>
                                <h3 class="productdes">$${ordered.price.toFixed(2)}</h3>
                            </div>
                        </div>`;
                    }
                );
                order.innerHTML += orderHTML;
                order.innerHTML+=`
                <h2>Total : ${history.total.toFixed(2)}</h2>
                `;
            }
        );
    }
});

function loadorder() {
    const savedItems = JSON.parse(localStorage.getItem("orderHistory"));
    if (savedItems && Array.isArray(savedItems)) { // Check if it's an array
        pastorder.push(...savedItems);
    }
}
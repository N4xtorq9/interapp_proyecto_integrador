import { showSuccess, showError, confirmAction } from "./alert.js";

let currentUser = JSON.parse(localStorage.getItem("interapp_current_user") || "null");
let currentPath = window.location.pathname;

if (!currentUser && !currentPath.endsWith("login.html") && !currentPath.endsWith("registro.html")) {
  window.location.href = "login.html";
}

// Notificaciones guardadas para el usuario que envió una propuesta.
let getNotifications = function () {
  return JSON.parse(localStorage.getItem("interapp_notifications") || "[]");
};
let saveNotifications = function (notifications) {
  localStorage.setItem("interapp_notifications", JSON.stringify(notifications));
};

// Campana de notificaciones en la barra superior.
let notificationBell = document.getElementById("notificationBell");
let notificationPanel = document.getElementById("notificationPanel");
let notificationBadge = document.getElementById("notificationBadge");
let notificationList = document.getElementById("notificationList");

let renderNotifications = function () {
  if (!currentUser || !notificationBadge || !notificationList) return;
  let mine = getNotifications().filter(function (item) { return item.user === currentUser.email; })
    .sort(function (a, b) { return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); });
  let unread = mine.filter(function (item) { return !item.read; }).length;
  notificationBadge.textContent = unread > 9 ? "9+" : String(unread);
  notificationBadge.hidden = unread === 0;
  if (!mine.length) {
    notificationList.innerHTML = '<div class="notification-empty">No tienes notificaciones por ahora.</div>';
    return;
  }
  notificationList.innerHTML = mine.map(function (item) {
    let isAccepted = (item.title || "").toLowerCase().includes("acept");
    return '<button type="button" class="notification-item ' + (!item.read ? "unread" : "") + '" data-notification-id="' + escapeHtml(item.id) + '">' +
      '<span class="notification-icon ' + (isAccepted ? "accepted" : "") + '">' + (isAccepted ? "✓" : "↔") + '</span>' +
      '<span class="notification-copy"><strong>' + escapeHtml(item.title || "Notificación") + '</strong><span>' + escapeHtml(item.message) + '</span><small>' +
      (item.createdAt ? new Date(item.createdAt).toLocaleString("es-CO") : "") + '</small></span>' +
      (!item.read ? '<i class="notification-unread-dot"></i>' : '') + '</button>';
  }).join("");
};

if (notificationBell && notificationPanel) {
  notificationBell.addEventListener("click", function () {
    let willOpen = notificationPanel.hidden;
    notificationPanel.hidden = !willOpen;
    notificationBell.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) renderNotifications();
  });
  notificationList.addEventListener("click", function (event) {
    let itemButton = event.target.closest("[data-notification-id]");
    if (!itemButton) return;
    let id = itemButton.getAttribute("data-notification-id");
    let notifications = getNotifications().map(function (item) {
      if (item.id === id && item.user === currentUser.email) item.read = true;
      return item;
    });
    saveNotifications(notifications);
    renderNotifications();
  });
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".notification-wrap")) {
      notificationPanel.hidden = true;
      notificationBell.setAttribute("aria-expanded", "false");
    }
  });
  window.addEventListener("storage", function (event) {
    if (event.key === "interapp_notifications") renderNotifications();
  });
}

let logoutButton = document.getElementById("logoutBtn");
if (logoutButton) {
  logoutButton.addEventListener("click", async function () {
    let shouldLogout = false;
    try {
      let result = await confirmAction("¿Cerrar sesión?", "Tu sesión se cerrará en este dispositivo.");
      shouldLogout = Boolean(result && result.isConfirmed);
    } catch (error) {
      shouldLogout = window.confirm("¿Deseas cerrar sesión?");
    }
    if (shouldLogout) {
      localStorage.removeItem("interapp_current_user");
      window.location.href = "login.html";
    }
  });
}

let getProducts = function () {
  return JSON.parse(localStorage.getItem("interapp_products") || "[]");
};
let saveProducts = function (products) {
  localStorage.setItem("interapp_products", JSON.stringify(products));
};
let getExchanges = function () {
  return JSON.parse(localStorage.getItem("interapp_exchanges") || "[]");
};
let escapeHtml = function (value) {
  return String(value || "").replace(/[&<>"']/g, function (character) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character];
  });
};

// Se renderiza después de declarar escapeHtml para evitar errores al iniciar
// cuando ya existen notificaciones guardadas.
if (notificationBell && notificationPanel) renderNotifications();
let getUserName = function (email) {
  let users = JSON.parse(localStorage.getItem("interapp_users") || "[]");
  let found = users.find(function (user) { return user.email === email; });
  return found ? found.name : "Usuario InterApp";
};
let showProductImage = function (image, name) {
  let modalElement = document.getElementById("imageViewerModal");
  if (!modalElement || !image) return;
  document.getElementById("imageViewer").src = image;
  document.getElementById("imageViewerTitle").textContent = name || "Imagen del producto";
  let modal = bootstrap.Modal.getOrCreateInstance(modalElement);
  modal.show();
};

let userName = document.getElementById("userName");
if (userName && currentUser) userName.textContent = currentUser.name.split(" ")[0];

let productCount = document.getElementById("productCount");
let exchangeCount = document.getElementById("exchangeCount");
let availableCount = document.getElementById("availableCount");
let refreshDashboardStats = function () {
  if (!currentUser || !productCount) return;
  let mine = getProducts().filter(function (item) { return item.owner === currentUser.email; });
  let exchanges = getExchanges().filter(function (item) {
    return item.sender === currentUser.email || item.recipient === currentUser.email || item.owner === currentUser.email;
  });
  productCount.textContent = mine.length;
  availableCount.textContent = mine.filter(function (item) { return item.status === "Disponible"; }).length;
  exchangeCount.textContent = exchanges.length;
};
refreshDashboardStats();

/* Catálogo comunitario en el panel */
let marketplaceList = document.getElementById("marketplaceList");
let marketSearch = document.getElementById("marketSearch");
let exchangeModalElement = document.getElementById("exchangeModal");
let exchangeModal = exchangeModalElement && window.bootstrap ? bootstrap.Modal.getOrCreateInstance(exchangeModalElement) : null;
let renderMarketplace = function (searchText) {
  if (!marketplaceList || !currentUser) return;
  let products = getProducts().filter(function (item) {
    let matchesSearch = (item.name + " " + item.description + " " + item.category).toLowerCase().includes((searchText || "").toLowerCase());
    return item.owner !== currentUser.email && item.status === "Disponible" && matchesSearch;
  });
  if (!products.length) {
    marketplaceList.innerHTML = '<div class="col-12"><div class="empty-state"><span>🔎</span><h3>No hay productos para mostrar</h3><p>Cuando otros usuarios publiquen productos disponibles, aparecerán aquí.</p></div></div>';
    return;
  }
  marketplaceList.innerHTML = products.map(function (item) {
    let photo = item.image
      ? '<button type="button" class="product-image-button" data-view="' + item.id + '" aria-label="Ver imagen de ' + escapeHtml(item.name) + '"><img class="product-photo" src="' + item.image + '" alt="' + escapeHtml(item.name) + '"></button>'
      : '<div class="product-placeholder">📦</div>';
    return '<div class="col-sm-6 col-lg-4"><article class="product-card">' + photo +
      '<div class="product-card-body"><div class="d-flex justify-content-between mb-2"><span class="status-pill">Disponible</span><small class="text-secondary">' + escapeHtml(item.category) + '</small></div>' +
      '<h3>' + escapeHtml(item.name) + '</h3><p>' + escapeHtml(item.description) + '</p><small class="product-owner">Publicado por ' + escapeHtml(getUserName(item.owner)) + '</small>' +
      '<button class="btn btn-primary btn-sm w-100 mt-3" data-market-propose="' + item.id + '">Proponer intercambio</button></div></article></div>';
  }).join("");
};

if (marketplaceList) {
  renderMarketplace("");
  if (marketSearch) marketSearch.addEventListener("input", function (event) { renderMarketplace(event.target.value); });
  marketplaceList.addEventListener("click", async function (event) {
    let viewId = event.target.closest("[data-view]") && event.target.closest("[data-view]").getAttribute("data-view");
    let proposeId = event.target.closest("[data-market-propose]") && event.target.closest("[data-market-propose]").getAttribute("data-market-propose");
    if (viewId) {
      let viewed = getProducts().find(function (item) { return item.id === viewId; });
      if (viewed) showProductImage(viewed.image, viewed.name);
    }
    if (proposeId) {
      let target = getProducts().find(function (item) { return item.id === proposeId && item.owner !== currentUser.email; });
      let mine = getProducts().filter(function (item) { return item.owner === currentUser.email && item.status === "Disponible"; });
      if (!target) return;
      if (!mine.length) {
        await showError("Primero publica un producto", "Necesitas tener al menos un producto disponible para proponer un intercambio.");
        return;
      }
      document.getElementById("targetProductId").value = target.id;
      document.getElementById("targetProductName").textContent = target.name;
      document.getElementById("targetProductInfo").textContent = target.description;
      document.getElementById("targetOwner").textContent = "Publicado por " + getUserName(target.owner);
      document.getElementById("myOfferProduct").innerHTML = mine.map(function (item) {
        return '<option value="' + item.id + '">' + escapeHtml(item.name) + '</option>';
      }).join("");
      document.getElementById("exchangeMessage").value = "";
      exchangeModal.show();
    }
  });
}

let exchangeForm = document.getElementById("exchangeForm");
if (exchangeForm && exchangeModal) {
  exchangeForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    let targetId = document.getElementById("targetProductId").value;
    let offeredId = document.getElementById("myOfferProduct").value;
    let message = document.getElementById("exchangeMessage").value.trim();
    let allProducts = getProducts();
    let target = allProducts.find(function (item) { return item.id === targetId && item.owner !== currentUser.email; });
    let offered = allProducts.find(function (item) { return item.id === offeredId && item.owner === currentUser.email; });
    if (!target || !offered || !message) {
      await showError("No se pudo enviar", "Verifica el producto que ofreces y escribe un mensaje.");
      return;
    }
    let exchanges = getExchanges();
    exchanges.push({
      id: Date.now().toString(),
      sender: currentUser.email,
      senderName: currentUser.name,
      recipient: target.owner,
      recipientName: getUserName(target.owner),
      targetProductId: target.id,
      targetProduct: target.name,
      offeredProductId: offered.id,
      offeredProduct: offered.name,
      message: message,
      status: "Pendiente",
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("interapp_exchanges", JSON.stringify(exchanges));
    exchangeModal.hide();
    exchangeForm.reset();
    refreshDashboardStats();
    await showSuccess("¡Propuesta enviada!", "Tu propuesta quedó registrada en Mis intercambios.");
  });
}

/* Gestión de publicaciones propias */
let productForm = document.getElementById("productForm");
let productList = document.getElementById("productList");
let selectedImageData = "";
let imageInput = document.getElementById("productImage");
let imagePreviewWrap = document.getElementById("imagePreviewWrap");
let imagePreview = document.getElementById("imagePreview");

if (imageInput) {
  imageInput.addEventListener("change", function () {
    let file = imageInput.files[0];
    if (!file) {
      selectedImageData = "";
      if (imagePreviewWrap) imagePreviewWrap.hidden = true;
      return;
    }
    if (!file.type.startsWith("image/")) {
      showError("Archivo no válido", "Selecciona un archivo de imagen.");
      imageInput.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showError("Imagen demasiado grande", "Selecciona una imagen de máximo 2 MB.");
      imageInput.value = "";
      return;
    }
    let reader = new FileReader();
    reader.onload = function () {
      selectedImageData = reader.result;
      imagePreview.src = selectedImageData;
      imagePreviewWrap.hidden = false;
    };
    reader.readAsDataURL(file);
  });
}

let renderProducts = function (searchText) {
  if (!productList || !currentUser) return;
  let products = getProducts().filter(function (item) {
    return item.owner === currentUser.email && item.name.toLowerCase().includes((searchText || "").toLowerCase());
  });
  if (!products.length) {
    productList.innerHTML = '<div class="col-12"><div class="empty-state"><span>📦</span><h3>No tienes productos todavía</h3><p>Publica tu primer producto usando el formulario.</p></div></div>';
    return;
  }
  productList.innerHTML = products.map(function (item) {
    let image = item.image
      ? '<button type="button" class="product-image-button" data-view="' + item.id + '" aria-label="Ver imagen de ' + escapeHtml(item.name) + '"><img class="product-photo" src="' + item.image + '" alt="' + escapeHtml(item.name) + '"></button>'
      : '<div class="product-placeholder">📦</div>';
    return '<div class="col-sm-6 col-lg-4"><article class="product-card">' + image +
      '<div class="product-card-body"><div class="d-flex justify-content-between mb-2"><span class="status-pill">' + escapeHtml(item.status) + '</span><small class="text-secondary">' + escapeHtml(item.category) + '</small></div>' +
      '<h3>' + escapeHtml(item.name) + '</h3><p>' + escapeHtml(item.description) + '</p><div class="d-flex flex-wrap gap-2"><button class="btn btn-sm btn-outline-primary" data-edit="' + item.id + '">Editar</button><button class="btn btn-sm btn-outline-danger" data-delete="' + item.id + '">Eliminar</button></div></div></article></div>';
  }).join("");
};

if (productForm) {
  renderProducts("");
  productForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    let id = document.getElementById("productId").value;
    let products = getProducts();
    let existingProduct = products.find(function (item) { return item.id === id && item.owner === currentUser.email; });
    let productData = {
      id: id || Date.now().toString(),
      name: document.getElementById("productName").value.trim(),
      category: document.getElementById("category").value,
      description: document.getElementById("description").value.trim(),
      image: selectedImageData || (existingProduct ? existingProduct.image : ""),
      owner: currentUser.email,
      status: existingProduct ? existingProduct.status : "Disponible"
    };
    if (!productData.name || !productData.description) {
      await showError("Información incompleta", "Escribe el nombre y la descripción del producto.");
      return;
    }
    if (id) products = products.map(function (item) { return item.id === id && item.owner === currentUser.email ? productData : item; });
    else products.push(productData);
    saveProducts(products);
    productForm.reset();
    selectedImageData = "";
    if (imagePreviewWrap) imagePreviewWrap.hidden = true;
    document.getElementById("productId").value = "";
    document.getElementById("formTitle").textContent = "Publicar un producto";
    renderProducts("");
    refreshDashboardStats();
    await showSuccess("Producto guardado", "Tu publicación se guardó correctamente.");
  });

  productList.addEventListener("click", async function (event) {
    let viewButton = event.target.closest("[data-view]");
    let editButton = event.target.closest("[data-edit]");
    let deleteButton = event.target.closest("[data-delete]");
    if (viewButton) {
      let viewed = getProducts().find(function (item) { return item.id === viewButton.getAttribute("data-view"); });
      if (viewed) showProductImage(viewed.image, viewed.name);
    }
    if (editButton) {
      let item = getProducts().find(function (product) { return product.id === editButton.getAttribute("data-edit") && product.owner === currentUser.email; });
      if (item) {
        document.getElementById("productId").value = item.id;
        document.getElementById("productName").value = item.name;
        document.getElementById("category").value = item.category;
        document.getElementById("description").value = item.description;
        selectedImageData = item.image || "";
        if (selectedImageData) {
          imagePreview.src = selectedImageData;
          imagePreviewWrap.hidden = false;
        } else if (imagePreviewWrap) imagePreviewWrap.hidden = true;
        document.getElementById("formTitle").textContent = "Editar producto";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    if (deleteButton) {
      let result = await confirmAction("¿Eliminar producto?", "Esta acción no se puede deshacer.");
      if (result.isConfirmed) {
        saveProducts(getProducts().filter(function (item) { return !(item.id === deleteButton.getAttribute("data-delete") && item.owner === currentUser.email); }));
        renderProducts("");
        refreshDashboardStats();
        await showSuccess("Producto eliminado", "La publicación fue eliminada.");
      }
    }
  });
  document.getElementById("cancelEdit").addEventListener("click", function () {
    productForm.reset();
    selectedImageData = "";
    if (imagePreviewWrap) imagePreviewWrap.hidden = true;
    document.getElementById("productId").value = "";
    document.getElementById("formTitle").textContent = "Publicar un producto";
  });
  document.getElementById("searchProducts").addEventListener("input", function (event) { renderProducts(event.target.value); });
}

/* Vista de propuestas enviadas y recibidas */
let exchangeList = document.getElementById("exchangeList");
let exchangeNotice = document.getElementById("exchangeNotice");

let renderExchangeList = function () {
  if (!exchangeList || !currentUser) return;
  let exchanges = getExchanges().filter(function (item) {
    return item.sender === currentUser.email || item.recipient === currentUser.email || item.owner === currentUser.email;
  }).sort(function (a, b) {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  if (!exchanges.length) {
    exchangeList.innerHTML = '<div class="empty-state"><span>🤝</span><h3>Aún no tienes propuestas</h3><p>Explora los productos de la comunidad desde el panel.</p><a class="btn btn-primary mt-2" href="dashboard.html">Explorar productos</a></div>';
    return;
  }

  exchangeList.innerHTML = exchanges.map(function (item) {
    let sentByMe = item.sender === currentUser.email || item.owner === currentUser.email;
    let isRecipient = item.recipient === currentUser.email;
    let status = item.status || "Pendiente";
    let statusClass = status === "Aceptada" ? "status-accepted" : (status === "Rechazada" ? "status-rejected" : "");
    let counterpart = sentByMe
      ? "Enviada a " + escapeHtml(item.recipientName || "otro usuario")
      : "Recibida de " + escapeHtml(item.senderName || "otro usuario");
    let mainText = sentByMe
      ? "Ofreces: " + escapeHtml(item.offeredProduct || item.product || "Producto")
      : "Te ofrecen: " + escapeHtml(item.offeredProduct || item.product || "Producto");
    let actions = "";
    if (isRecipient && status === "Pendiente") {
      actions = '<div class="exchange-actions"><button class="btn btn-sm btn-primary" data-exchange-accept="' + item.id + '">Aceptar</button><button class="btn btn-sm btn-outline-danger" data-exchange-reject="' + item.id + '">Rechazar</button></div>';
    } else if (sentByMe && status === "Pendiente") {
      actions = '<small class="text-secondary">Esperando respuesta del propietario.</small>';
    }
    let dateText = item.createdAt ? new Date(item.createdAt).toLocaleDateString("es-CO") : "";
    return '<article class="exchange-card"><div class="exchange-card-info"><div class="exchange-card-top"><b>' + mainText + '</b><span class="status-pill ' + statusClass + '">' + escapeHtml(status) + '</span></div><div class="muted small">' + counterpart + ' · Producto solicitado: ' + escapeHtml(item.targetProduct || item.wanted || "No especificado") + '</div><div class="text-secondary small mt-1">' + escapeHtml(item.message || item.description || "") + '</div><small class="exchange-date">' + dateText + '</small>' + actions + '</div></article>';
  }).join("");
};

if (exchangeList && currentUser) {
  renderExchangeList();

  exchangeList.addEventListener("click", async function (event) {
    let acceptButton = event.target.closest("[data-exchange-accept]");
    let rejectButton = event.target.closest("[data-exchange-reject]");
    if (!acceptButton && !rejectButton) return;

    let exchangeId = acceptButton
      ? acceptButton.getAttribute("data-exchange-accept")
      : rejectButton.getAttribute("data-exchange-reject");
    let nextStatus = acceptButton ? "Aceptada" : "Rechazada";
    let confirmation = await confirmAction(
      nextStatus === "Aceptada" ? "¿Aceptar intercambio?" : "¿Rechazar intercambio?",
      nextStatus === "Aceptada"
        ? "Se notificará al usuario que envió la propuesta."
        : "Se notificará al usuario que envió la propuesta."
    );
    if (!confirmation.isConfirmed) return;

    let exchanges = getExchanges();
    let selected = exchanges.find(function (item) {
      return item.id === exchangeId && item.recipient === currentUser.email && (item.status || "Pendiente") === "Pendiente";
    });
    if (!selected) {
      await showError("Propuesta no disponible", "Esta propuesta ya fue respondida o no está dirigida a tu cuenta.");
      renderExchangeList();
      return;
    }

    selected.status = nextStatus;
    selected.respondedAt = new Date().toISOString();
    selected.respondedBy = currentUser.email;
    localStorage.setItem("interapp_exchanges", JSON.stringify(exchanges));

    let notifications = getNotifications();
    notifications.push({
      id: Date.now().toString(),
      user: selected.sender,
      title: "Respuesta a tu propuesta",
      message: currentUser.name + " " + (nextStatus === "Aceptada" ? "aceptó" : "rechazó") + " tu propuesta para intercambiar " + (selected.offeredProduct || "tu producto") + " por " + (selected.targetProduct || "el producto publicado") + ".",
      exchangeId: selected.id,
      read: false,
      createdAt: new Date().toISOString()
    });
    saveNotifications(notifications);

    renderExchangeList();
    if (exchangeNotice) {
      exchangeNotice.innerHTML = '<div class="alert ' + (nextStatus === "Aceptada" ? "alert-success" : "alert-warning") + ' mb-3">La propuesta fue ' + nextStatus.toLowerCase() + '. Se guardó una notificación para el usuario que la envió.</div>';
    }
    await showSuccess(
      nextStatus === "Aceptada" ? "¡Intercambio aceptado!" : "Propuesta rechazada",
      "El usuario que envió la propuesta recibirá un aviso cuando vuelva a ingresar a InterApp en este navegador."
    );
  });
}

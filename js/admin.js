// Import Firebase functions
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadString
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { db, storage } from './firebase-config.js';

console.log("Firebase initialized successfully");
console.log("DB object:", db);
console.log("Storage object:", storage);

// Setup event listeners for existing and new variants
function setupVariantEventListeners(variantElement) {
  // Remove variant button
  const removeVariantBtn = variantElement.querySelector('.remove-variant-btn');
  removeVariantBtn.addEventListener('click', function () {
    const variantsList = this.closest('.packages-container').querySelector('div[id$="variants-list"]');
    if (variantsList.querySelectorAll('.variant-item').length > 1) {
      variantElement.remove();
    } else {
      alert('Phải có ít nhất một gói sản phẩm!');
    }
  });

  // Add package button for this variant
  const addPackageBtn = variantElement.querySelector('.add-package-btn');
  const packagesList = variantElement.querySelector('.packages-list');

  addPackageBtn.addEventListener('click', function () {
    const packageItem = document.createElement('div');
    packageItem.className = 'package-item';
    packageItem.innerHTML = `
      <input
        type="text"
        name="package-duration[]"
        placeholder="Thời hạn (VD: 1 tháng, 6 tháng)"
        required
      />
      <input
        type="number"
        name="package-price[]"
        placeholder="Giá (VD: 69000)"
        required
      />
      <input
        type="number"
        name="package-original-price[]"
        placeholder="Giá gốc (VD: 100000)"
        required
      />
      <button type="button" class="remove-package-btn">
        <i class="fas fa-times"></i>
      </button>
    `;
    packagesList.appendChild(packageItem);

    // Add remove package event listener
    const removePackageBtn = packageItem.querySelector('.remove-package-btn');
    removePackageBtn.addEventListener('click', function () {
      if (packagesList.querySelectorAll('.package-item').length > 1) {
        packageItem.remove();
      } else {
        alert('Mỗi gói phải có ít nhất một thời hạn!');
      }
    });
  });

  // Remove package buttons for existing packages in this variant
  variantElement.querySelectorAll('.remove-package-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const packagesList = this.closest('.packages-list');
      if (packagesList.querySelectorAll('.package-item').length > 1) {
        this.closest('.package-item').remove();
      } else {
        alert('Mỗi gói phải có ít nhất một thời hạn!');
      }
    });
  });
}

// Helper function to add a new variant
function addNewVariant(variantsContainer) {
  const variantItem = document.createElement('div');
  variantItem.className = 'variant-item';
  variantItem.innerHTML = `
    <div class="variant-header">
      <input
        type="text"
        name="variant-name[]"
        placeholder="Tên gói (VD: Premium, Pro, Edu)"
        required
        class="variant-name-input"
      />
      <input
        type="text"
        name="variant-description[]"
        placeholder="Mô tả gói (VD: Phiên bản cao cấp)"
        class="variant-description-input"
      />
      <button type="button" class="remove-variant-btn">
        <i class="fas fa-times"></i> Xóa gói
      </button>
    </div>

    <div class="packages-for-variant">
      <label>Các thời hạn cho gói này:</label>
      <div class="packages-list">
        <div class="package-item">
          <input
            type="text"
            name="package-duration[]"
            placeholder="Thời hạn (VD: 1 tháng, 6 tháng)"
            required
          />
          <input
            type="number"
            name="package-price[]"
            placeholder="Giá (VD: 69000)"
            required
          />
          <input
            type="number"
            name="package-original-price[]"
            placeholder="Giá gốc (VD: 100000)"
            required
          />
          <button type="button" class="remove-package-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <button type="button" class="add-package-btn btn-secondary">
        <i class="fas fa-plus"></i> Thêm thời hạn
      </button>
    </div>
  `;
  variantsContainer.appendChild(variantItem);

  // Add event listeners to the new variant
  setupVariantEventListeners(variantItem);
}

// Helper function to collect form data
async function collectFormData(formId, imageInputId, variantsListId) {
  console.log("Getting form data...");

  // Get form data
  const form = document.getElementById(formId);
  const name = form.querySelector('#' + formId.replace('-form', '-name')).value.trim();
  const type = form.querySelector('#' + formId.replace('-form', '-type')).value;
  const shortDescription = form.querySelector('#' + formId.replace('-form', '-short-desc')).value.trim();
  const description = form.querySelector('#' + formId.replace('-form', '-description')).value.trim();

  console.log("Form data collected:", { name, type, shortDescription, description });

  // Validate required fields
  if (!name || !type || !shortDescription || !description) {
    throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
  }

  console.log("Basic validation passed");

  // Get variants and packages data
  const variantItems = document.querySelectorAll('#' + variantsListId + ' .variant-item');

  if (variantItems.length === 0) {
    throw new Error("Vui lòng thêm ít nhất một gói sản phẩm");
  }

  const variants = [];
  variantItems.forEach((variantItem, variantIndex) => {
    const variantName = variantItem.querySelector('input[name="variant-name[]"]').value.trim();
    const variantDescription = variantItem.querySelector('input[name="variant-description[]"]').value.trim();

    if (!variantName) {
      throw new Error(`Vui lòng nhập tên cho gói ${variantIndex + 1}`);
    }

    // Get packages for this variant
    const packageItems = variantItem.querySelectorAll('.package-item');
    const packages = [];

    packageItems.forEach((packageItem, packageIndex) => {
      const duration = packageItem.querySelector('input[name="package-duration[]"]').value.trim();
      const price = parseInt(packageItem.querySelector('input[name="package-price[]"]').value);
      const originalPrice = parseInt(packageItem.querySelector('input[name="package-original-price[]"]').value);

      if (!duration || !price || !originalPrice) {
        throw new Error(`Vui lòng điền đầy đủ thông tin cho thời hạn ${packageIndex + 1} của gói ${variantName}`);
      }

      if (price >= originalPrice) {
        throw new Error(`Giá bán phải nhỏ hơn giá gốc cho ${duration} của gói ${variantName}`);
      }

      packages.push({
        duration: duration,
        price: price,
        originalPrice: originalPrice,
        discountPercent: Math.round((1 - price / originalPrice) * 100)
      });
    });

    if (packages.length === 0) {
      throw new Error(`Gói ${variantName} phải có ít nhất một thời hạn`);
    }

    variants.push({
      name: variantName,
      description: variantDescription,
      packages: packages
    });
  });

  console.log("Variants processed:", variants);

  // Handle image - Store as data URL to avoid CORS issues
  let imageUrl = '';
  const imageInput = document.getElementById(imageInputId);
  const imageFile = imageInput.files[0];

  if (imageFile) {
    console.log("Converting image to data URL...", imageFile.name);
    try {
      // Convert file to data URL (base64 with prefix)
      imageUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result); // This includes data:image/jpeg;base64, prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      console.log("Image converted to data URL, length:", imageUrl.length);
      // Truncate for logging
      console.log("Data URL preview:", imageUrl.substring(0, 100) + "...");
    } catch (imageError) {
      console.error("Error converting image:", imageError);
      imageUrl = '';
    }
  } else {
    // If we're editing and no new image was selected, check for existing image preview
    const imagePreview = document.getElementById(imageInputId.replace('image', 'image-preview'));
    if (imagePreview && imagePreview.querySelector('img')) {
      imageUrl = imagePreview.querySelector('img').src;
    }
    console.log("No new image file selected, using existing image if available");
  }

  // Create product object
  return {
    name,
    type,
    shortDescription,
    description,
    imageUrl,
    variants,
    updatedAt: new Date(),
    createdAt: new Date() // This will be overwritten for updates
  };
}

// DOM Elements
document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM loaded, setting up admin page");

  // Tab navigation
  const menuItems = document.querySelectorAll('.admin-menu li a');
  const sections = document.querySelectorAll('.admin-section');

  menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      // Remove active class from all menu items
      menuItems.forEach(menuItem => {
        menuItem.parentElement.classList.remove('active');
      });

      // Add active class to clicked menu item
      this.parentElement.classList.add('active');

      // Hide all sections
      sections.forEach(section => {
        section.classList.remove('active');
      });

      // Show the section corresponding to the clicked menu item
      const targetId = this.getAttribute('href').substring(1);
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Add variant button functionality
  const addVariantBtn = document.getElementById('add-variant-btn');
  const variantsList = document.getElementById('variants-list');

  if (addVariantBtn && variantsList) {
    addVariantBtn.addEventListener('click', function () {
      addNewVariant(variantsList);
    });
  }

  // Edit modal add variant button functionality
  const editAddVariantBtn = document.getElementById('edit-add-variant-btn');
  const editVariantsList = document.getElementById('edit-variants-list');

  if (editAddVariantBtn && editVariantsList) {
    editAddVariantBtn.addEventListener('click', function () {
      addNewVariant(editVariantsList);
    });
  }

  // Close edit modal button
  const closeEditModalBtn = document.getElementById('close-edit-modal');
  const cancelEditBtn = document.getElementById('cancel-edit');
  const editModal = document.getElementById('edit-product-modal');

  if (closeEditModalBtn && editModal) {
    closeEditModalBtn.addEventListener('click', function () {
      editModal.style.display = 'none';
    });
  }

  if (cancelEditBtn && editModal) {
    cancelEditBtn.addEventListener('click', function () {
      // Không đóng modal khi nhấn Cancel, thay vào đó làm mới form
      const productId = document.getElementById('edit-product-form').dataset.productId;
      if (productId) {
        // Tải lại dữ liệu sản phẩm từ Firestore
        editProduct(productId);
        showNotification('Đã làm mới form', 'info');
      }
    });
  }

  // Close modal when clicking outside
  window.addEventListener('click', function (event) {
    // Không đóng modal khi nhấn ra ngoài
    // if (event.target === editModal) {
    //   editModal.style.display = 'none';
    // }
  });

  // Image preview functionality for add form
  const imageInput = document.getElementById('product-image');
  const imagePreview = document.getElementById('image-preview');

  if (imageInput && imagePreview) {
    imageInput.addEventListener('change', function () {
      handleImagePreview(this, imagePreview);
    });
  }

  // Image preview functionality for edit form
  const editImageInput = document.getElementById('edit-product-image');
  const editImagePreview = document.getElementById('edit-image-preview');

  if (editImageInput && editImagePreview) {
    editImageInput.addEventListener('change', function () {
      handleImagePreview(this, editImagePreview);
    });
  }

  // Helper function for image preview
  function handleImagePreview(input, previewElement) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        previewElement.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`;
        previewElement.style.display = 'block';
      };

      reader.readAsDataURL(input.files[0]);
    } else {
      previewElement.innerHTML = '';
      previewElement.style.display = 'none';
    }
  }

  // Setup event listeners for existing variants
  document.querySelectorAll('.variant-item').forEach(variant => {
    setupVariantEventListeners(variant);
  });

  // Form submission for add product
  const productForm = document.getElementById('add-product-form');

  if (productForm) {
    console.log("Add product form found, adding event listener");

    // Add reset handler
    productForm.addEventListener('reset', function () {
      // Reset image preview
      const imagePreview = document.getElementById('image-preview');
      if (imagePreview) {
        imagePreview.innerHTML = '';
        imagePreview.style.display = 'none';
      }

      // Reset to default variant
      setTimeout(() => {
        const variantsList = document.getElementById('variants-list');
        if (variantsList && variantsList.children.length === 0) {
          addNewVariant(variantsList);
        }
      }, 10);
    });

    productForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      console.log("=== ADD PRODUCT FORM SUBMISSION STARTED ===");

      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Đang lưu...';
      submitBtn.disabled = true;

      try {
        const productData = await collectFormData('add-product-form', 'product-image', 'variants-list');

        // Add to Firestore
        console.log("Adding new product to Firestore...");
        const productsCollection = collection(db, "products");
        const docRef = await addDoc(productsCollection, productData);
        console.log("Product added with ID:", docRef.id);

        showNotification('Sản phẩm đã được thêm thành công!', 'success');

        // Reset form
        productForm.reset();

        // Refresh product list
        await loadProducts();

        console.log("=== ADD PRODUCT FORM SUBMISSION COMPLETED ===");

      } catch (error) {
        console.error("=== ERROR IN FORM SUBMISSION ===");
        console.error("Error details:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        showNotification(error.message || 'Có lỗi xảy ra khi lưu sản phẩm!', 'error');
      } finally {
        // Restore button state
        console.log("Restoring button state");
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  } else {
    console.error("Add product form not found!");
  }

  // Form submission for edit product
  const editProductForm = document.getElementById('edit-product-form');

  if (editProductForm) {
    console.log("Edit product form found, adding event listener");

    editProductForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      console.log("=== EDIT PRODUCT FORM SUBMISSION STARTED ===");

      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Đang lưu...';
      submitBtn.disabled = false;

      try {
        const productId = this.dataset.productId;

        if (!productId) {
          throw new Error("Không tìm thấy ID sản phẩm!");
        }

        const productData = await collectFormData('edit-product-form', 'edit-product-image', 'edit-variants-list');

        // Get original createdAt date
        const productDoc = await getDoc(doc(db, "products", productId));
        if (productDoc.exists()) {
          productData.createdAt = productDoc.data().createdAt;
        } else {
          productData.createdAt = new Date();
        }

        // Update product in Firestore
        console.log("Updating product with ID:", productId);
        await updateDoc(doc(db, "products", productId), productData);

        showNotification('Sản phẩm đã được cập nhật thành công!', 'success');

        // Close the modal
        document.getElementById('edit-product-modal').style.display = 'none';

        // Refresh product list
        await loadProducts();

        console.log("=== EDIT PRODUCT FORM SUBMISSION COMPLETED ===");

      } catch (error) {
        console.error("=== ERROR IN EDIT FORM SUBMISSION ===");
        console.error("Error details:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        showNotification(error.message || 'Có lỗi xảy ra khi cập nhật sản phẩm!', 'error');
      } finally {
        // Restore button state
        console.log("Restoring button state");
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  } else {
    console.error("Edit product form not found!");
  }

  // Load products on page load
  loadProducts();
});

// Function to load products
async function loadProducts() {
  const productTableBody = document.getElementById('product-table-body');

  if (!productTableBody) {
    console.error("Product table body not found");
    return;
  }

  try {
    console.log("Loading products from Firestore...");
    // Clear existing rows
    productTableBody.innerHTML = '<tr><td colspan="6" class="loading">Đang tải dữ liệu...</td></tr>';

    // Get products from Firestore
    const querySnapshot = await getDocs(collection(db, "products"));
    console.log("Products loaded:", querySnapshot.size);

    // Clear loading message
    productTableBody.innerHTML = '';

    if (querySnapshot.empty) {
      productTableBody.innerHTML = '<tr><td colspan="6" class="no-data">Chưa có sản phẩm nào</td></tr>';
      return;
    }

    // Add products to table
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const productId = doc.id;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="product-image">
            ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}">` : product.name.substring(0, 2)}
          </div>
        </td>
        <td>
          <div class="product-info-cell">
            <div>
              <div class="product-name">${product.name}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="product-short-desc">${product.shortDescription || 'Chưa có mô tả'}</div>
        </td>
        <td>${product.type}</td>
        <td>${product.variants ? product.variants.length : 0} gói</td>
        <td>
          <div class="product-actions">
            <button class="action-btn edit-btn" data-id="${productId}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" data-id="${productId}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      `;

      productTableBody.appendChild(row);

      // Add event listeners to action buttons
      const deleteBtn = row.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => deleteProduct(productId, product.name));

      // Add event listener for edit button
      const editBtn = row.querySelector('.edit-btn');
      editBtn.addEventListener('click', () => editProduct(productId));
    });

  } catch (error) {
    console.error("Error loading products: ", error);
    productTableBody.innerHTML = '<tr><td colspan="6" class="error">Lỗi khi tải dữ liệu</td></tr>';
  }
}

// Function to delete a product
async function deleteProduct(productId, productName) {
  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
    try {
      await deleteDoc(doc(db, "products", productId));
      showNotification('Sản phẩm đã được xóa thành công!', 'success');
      loadProducts();
    } catch (error) {
      console.error("Error deleting product: ", error);
      showNotification('Có lỗi xảy ra khi xóa sản phẩm!', 'error');
    }
  }
}

// Function to edit a product
async function editProduct(productId) {
  try {
    // Get product data
    const productDoc = await getDoc(doc(db, "products", productId));

    if (!productDoc.exists()) {
      showNotification('Không tìm thấy sản phẩm!', 'error');
      return;
    }

    const product = productDoc.data();

    // Fill edit form with product data
    document.getElementById('edit-product-name').value = product.name;
    document.getElementById('edit-product-type').value = product.type;
    document.getElementById('edit-product-short-desc').value = product.shortDescription;
    document.getElementById('edit-product-description').value = product.description;

    // Show image preview if exists
    const imagePreview = document.getElementById('edit-image-preview');
    if (imagePreview && product.imageUrl) {
      imagePreview.innerHTML = `<img src="${product.imageUrl}" alt="Image Preview">`;
      imagePreview.style.display = 'block';
    } else if (imagePreview) {
      imagePreview.innerHTML = '';
      imagePreview.style.display = 'none';
    }

    // Clear existing variants
    const variantsList = document.getElementById('edit-variants-list');
    if (variantsList) {
      variantsList.innerHTML = '';

      // Add variants from product data
      product.variants.forEach(variant => {
        const variantItem = document.createElement('div');
        variantItem.className = 'variant-item';
        variantItem.innerHTML = `
          <div class="variant-header">
            <input
              type="text"
              name="variant-name[]"
              placeholder="Tên gói (VD: Premium, Pro, Edu)"
              required
              class="variant-name-input"
              value="${variant.name}"
            />
            <input
              type="text"
              name="variant-description[]"
              placeholder="Mô tả gói (VD: Phiên bản cao cấp)"
              class="variant-description-input"
              value="${variant.description || ''}"
            />
            <button type="button" class="remove-variant-btn">
              <i class="fas fa-times"></i> Xóa gói
            </button>
          </div>

          <div class="packages-for-variant">
            <label>Các thời hạn cho gói này:</label>
            <div class="packages-list">
              ${variant.packages.map(pkg => `
                <div class="package-item">
                  <input
                    type="text"
                    name="package-duration[]"
                    placeholder="Thời hạn (VD: 1 tháng, 6 tháng)"
                    required
                    value="${pkg.duration}"
                  />
                  <input
                    type="number"
                    name="package-price[]"
                    placeholder="Giá (VD: 69000)"
                    required
                    value="${pkg.price}"
                  />
                  <input
                    type="number"
                    name="package-original-price[]"
                    placeholder="Giá gốc (VD: 100000)"
                    required
                    value="${pkg.originalPrice}"
                  />
                  <button type="button" class="remove-package-btn">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              `).join('')}
            </div>
            <button type="button" class="add-package-btn btn-secondary">
              <i class="fas fa-plus"></i> Thêm thời hạn
            </button>
          </div>
        `;
        variantsList.appendChild(variantItem);

        // Add event listeners to the new variant
        setupVariantEventListeners(variantItem);
      });
    }

    // Store product ID in form for update
    const editForm = document.getElementById('edit-product-form');
    editForm.dataset.productId = productId;

    // Show the modal
    const modal = document.getElementById('edit-product-modal');
    modal.style.display = 'flex';

  } catch (error) {
    console.error("Error loading product for edit: ", error);
    showNotification('Có lỗi xảy ra khi tải thông tin sản phẩm!', 'error');
  }
}

// Function to show notification
function showNotification(message, type = 'info') {
  // Create notification element if it doesn't exist
  let notification = document.querySelector('.admin-notification');

  if (!notification) {
    notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    document.body.appendChild(notification);

    // Add styles for notification
    notification.style.position = 'fixed';
    notification.style.bottom = '-100px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '30px';
    notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    notification.style.backdropFilter = 'blur(10px)';
    notification.style.WebkitBackdropFilter = 'blur(10px)';
    notification.style.zIndex = '1000';
    notification.style.transition = 'all 0.3s ease';
  }

  // Set type-specific styles
  if (type === 'success') {
    notification.style.background = 'rgba(40, 167, 69, 0.9)';
    notification.style.border = '1px solid rgba(40, 167, 69, 0.3)';
    notification.style.color = 'white';
  } else if (type === 'error') {
    notification.style.background = 'rgba(220, 53, 69, 0.9)';
    notification.style.border = '1px solid rgba(220, 53, 69, 0.3)';
    notification.style.color = 'white';
  } else {
    notification.style.background = 'rgba(13, 21, 43, 0.8)';
    notification.style.border = '1px solid rgba(89, 118, 255, 0.3)';
    notification.style.color = 'white';
  }

  // Set message
  notification.textContent = message;
  notification.className = `admin-notification ${type}`;

  // Show notification
  setTimeout(() => {
    notification.style.bottom = '30px';
  }, 10);

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.bottom = '-100px';
  }, 3000);
}
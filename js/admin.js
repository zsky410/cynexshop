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
      variantsList.appendChild(variantItem);

      // Add event listeners to the new variant
      setupVariantEventListeners(variantItem);
    });
  }

  // Setup event listeners for existing and new variants
  function setupVariantEventListeners(variantElement) {
    // Remove variant button
    const removeVariantBtn = variantElement.querySelector('.remove-variant-btn');
    removeVariantBtn.addEventListener('click', function () {
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

  // Setup event listeners for existing variants
  document.querySelectorAll('.variant-item').forEach(variant => {
    setupVariantEventListeners(variant);
  });

  // Image preview functionality
  const imageInput = document.getElementById('product-image');
  const imagePreview = document.getElementById('image-preview');

  if (imageInput && imagePreview) {
    imageInput.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
          imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`;
          imagePreview.style.display = 'block';
        };

        reader.readAsDataURL(this.files[0]);
      } else {
        imagePreview.innerHTML = '';
        imagePreview.style.display = 'none';
      }
    });
  }

  // Form submission
  const productForm = document.getElementById('add-product-form');

  if (productForm) {
    console.log("Form found, adding event listener");
    productForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      console.log("=== FORM SUBMISSION STARTED ===");

      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Đang lưu...';
      submitBtn.disabled = true;

      try {
        console.log("Getting form data...");

        // Get form data
        const name = document.getElementById('product-name').value.trim();
        const type = document.getElementById('product-type').value;
        const shortDescription = document.getElementById('product-short-desc').value.trim();
        const description = document.getElementById('product-description').value.trim();

        console.log("Form data collected:", { name, type, shortDescription, description });

        // Validate required fields
        if (!name || !type || !shortDescription || !description) {
          throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
        }

        console.log("Basic validation passed");

        // Get variants and packages data
        const variantItems = document.querySelectorAll('.variant-item');

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
          console.log("No image file selected");
        }

        // Create product object
        const product = {
          name,
          type,
          shortDescription,
          description,
          imageUrl,
          variants,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        console.log("Final product object:", product);

        // Add to Firestore
        console.log("Adding product to Firestore...");
        console.log("DB reference:", db);

        const productsCollection = collection(db, "products");
        console.log("Products collection:", productsCollection);

        const docRef = await addDoc(productsCollection, product);
        console.log("Product added with ID:", docRef.id);

        // Show success message
        showNotification('Sản phẩm đã được thêm thành công!', 'success');

        // Reset form
        productForm.reset();
        if (imagePreview) {
          imagePreview.innerHTML = '';
          imagePreview.style.display = 'none';
        }

        // Refresh product list
        await loadProducts();

        console.log("=== FORM SUBMISSION COMPLETED ===");

      } catch (error) {
        console.error("=== ERROR IN FORM SUBMISSION ===");
        console.error("Error details:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        showNotification(error.message || 'Có lỗi xảy ra khi thêm sản phẩm!', 'error');
      } finally {
        // Restore button state
        console.log("Restoring button state");
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  } else {
    console.error("Product form not found!");
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
-- Alter users table to modify password column
ALTER TABLE users ALTER COLUMN password TYPE VARCHAR(255);

-- Clear existing data
TRUNCATE TABLE request, product, supplier, users, onboarding RESTART IDENTITY CASCADE;

-- Insert users with proper roles and departments
INSERT INTO users (email, password, name, department, role, created_at, updated_at)
VALUES 
('admin@company.com', 'admin123', 'Admin User', 'IT', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('requester@company.com', 'admin123', 'Requester User', 'HR', 'REQUESTER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('reviewer@company.com', 'admin123', 'Reviewer User', 'Finance', 'REVIEWER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('manager@company.com', 'admin123', 'Sourcing Manager', 'Procurement', 'SOURCING_MANAGER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert suppliers with proper categories and status
INSERT INTO supplier (name, email, phone, category, contact_person, status)
VALUES 
('Tech Supplies Inc', 'contact@techsupplies.com', '123-456-7890', 'Technology', 'John Doe', 'Active'),
('Office Essentials', 'info@officeessentials.com', '987-654-3210', 'Office Supplies', 'Jane Smith', 'Active'),
('Global Electronics', 'sales@globalelectronics.com', '555-123-4567', 'Technology', 'Mike Johnson', 'Active'),
('Furniture World', 'contact@furnitureworld.com', '555-987-6543', 'Furniture', 'Sarah Williams', 'Active');

-- Insert products with proper categories and supplier relationships
INSERT INTO product (name, description, category, price, supplier_id, model_no)
VALUES 
('Laptop Pro', 'High-performance business laptop', 'Electronics', 1299.99, 1, 'LAP-2024-001'),
('4K Monitor', '27-inch 4K Professional Monitor', 'Electronics', 499.99, 1, 'MON-2024-001'),
('Desktop PC', 'Workstation Desktop Computer', 'Electronics', 899.99, 3, 'PC-2024-001'),
('Ergonomic Chair', 'Executive Office Chair', 'Office Supplies', 299.99, 2, 'CHAIR-2024-001'),
('Standing Desk', 'Electric Height Adjustable Desk', 'Office Supplies', 399.99, 2, 'DESK-2024-001'),
('Office Sofa', 'Modern Office Lounge Sofa', 'Furniture', 799.99, 4, 'SOFA-2024-001'),
('Conference Table', 'Large Conference Room Table', 'Furniture', 1299.99, 4, 'TABLE-2024-001');

-- Insert requests with proper relationships and required fields
INSERT INTO request (requested_by, quantity, status, product_id, department, priority, justification)
VALUES 
('requester@company.com', 2, 'PENDING', 1, 'IT', 'High', 'New employee workstation setup'),
('requester@company.com', 5, 'IN_PROGRESS', 4, 'HR', 'Medium', 'Office furniture upgrade'),
('reviewer@company.com', 1, 'PENDING', 6, 'Finance', 'Low', 'Reception area renovation'),
('requester@company.com', 3, 'APPROVED', 2, 'IT', 'High', 'Development team monitors');

-- Insert onboarding requests with proper supplier relationships
INSERT INTO onboarding (documents, status, submitted_at, supplier_id, notes)
VALUES 
('certification.pdf,insurance.pdf', 'Pending', CURRENT_TIMESTAMP, 1, 'New technology supplier for IT equipment'),
('certification.pdf,insurance.pdf', 'In Review', CURRENT_TIMESTAMP, 4, 'New furniture supplier for office renovation'); 
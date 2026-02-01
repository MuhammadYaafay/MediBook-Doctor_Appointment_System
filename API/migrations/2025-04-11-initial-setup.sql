CREATE TABLE
    users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM ('admin', 'doctor', 'patient') NOT NULL DEFAULT 'patient',
        image_url VARCHAR(255),
        phone VARCHAR(20),
        allergies TEXT,
        chronic_conditions TEXT,
        current_medications TEXT,
        past_surgeries TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    doctors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        specialization VARCHAR(255) NOT NULL,
        experience INT NOT NULL,
        fee DECIMAL(10, 2) NOT NULL,
        rating DECIMAL(3,1) DEFAULT 0,
        reviews_count INT DEFAULT 0,
        totalPatients INT DEFAULT 0,
        availability VARCHAR(255),
        about TEXT,
        services JSON,
        languages JSON,
        education JSON,
        certifications JSON,
        location JSON,
        available_slots JSON,
        total_appointments INT DEFAULT 0,   
        completed_appointments INT DEFAULT 0,
        cancelled_appointments INT DEFAULT 0,
        revenue DECIMAL(10,2)	
        patientsGrowth DECIMAL(5,2)	
        appointmentsGrowth DECIMAL(5,2)	
        revenueGrowth DECIMAL(5,2)	
        is_approved TINYINT (1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

CREATE TABLE
    appointments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        doctor_id INT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status ENUM ('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        payment_status ENUM ('pending', 'completed', 'failed') DEFAULT 'pending',
        fee DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors (id) ON DELETE CASCADE
    );

CREATE TABLE
    payments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        appointment_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        razorpay_order_id VARCHAR(255) NOT NULL,
        razorpay_payment_id VARCHAR(255),
        payment_status ENUM ('pending', 'completed', 'failed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments (id) ON DELETE CASCADE
    );

    CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    user_id INT NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

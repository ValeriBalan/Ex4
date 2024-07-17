CREATE TABLE tbl_26_users (
    unique_code VARCHAR(20) NOT NULL PRIMARY KEY,
    full_name VARCHAR(20) NOT NULL,
    password_code INT NOT NULL
);

CREATE TABLE tbl_26_posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    unique_code VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location VARCHAR(50) NOT NULL,
    vacation_type VARCHAR(20) NOT NULL,
    FOREIGN KEY (unique_code) REFERENCES 
    tbl_26_users(unique_code),
    CHECK (DATEDIFF(end_date, start_date) <= 7)
);

select * from tbl_26_users;
select * from tbl_26_posts;
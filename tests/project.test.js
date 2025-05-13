import request from 'supertest';
import app from '../server'; 

describe('User API', () => {
  it('should create a new admin user (signup)', async () => {
    const response = await request(app)
      .post('/api/v1/user/signup')
      .send({
        name: 'Sonu',
        email: 'sonu@gmail.com',
        role: 'admin', 
        password: 'Welcome1',
        companyID: '68226a8a06bfcf1d1508ff32', 
      });

    expect(response.status).toBe(201); 
    expect(response.body).toHaveProperty('message', 'User created successfully');
    expect(response.body.user).toHaveProperty('role', 'admin'); 
  });

  it('should login the user (signin)', async () => {
    const response = await request(app)
      .post('/api/v1/user/signin')
      .send({
        email: 'john@example.com', 
        password: 'password123',
      });

    expect(response.status).toBe(200); 
    expect(response.body).toHaveProperty('token'); 
  });
});

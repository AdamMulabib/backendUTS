export class UserController {
    getUsers(req, res) {
        res.send('Get all users');
    }

    getUserById(req, res) {
        res.send('Get user by ID');
    }

    createUser(req, res) {
        res.send('Create new user');
    }

    updateUser(req, res) {
        res.send('Update user');
    }

    deleteUser(req, res) {
        res.send('Delete user');
    }
}
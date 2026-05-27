import '../domain/user.dart';

class AuthRepository {
  Future<User> findByEmail(String email) async {
    return User('usr_1', email);
  }
}

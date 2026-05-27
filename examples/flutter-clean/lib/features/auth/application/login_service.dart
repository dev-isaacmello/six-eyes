import '../domain/user.dart';
import '../infrastructure/auth_repository.dart';

class LoginService {
  LoginService(this.repository);

  final AuthRepository repository;

  Future<User> login(String email) {
    return repository.findByEmail(email);
  }
}

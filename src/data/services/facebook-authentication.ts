import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "../contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import { LoadUserAccountRepository } from "../contracts/repos";
export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository
  ) {}
  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser({
      token: params.token,
    });
    if (fbData !== undefined) {
      await this.loadUserAccountRepo.load({ email: fbData.email });
    }
    return new AuthenticationError();
  }
}

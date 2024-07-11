import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "../contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import {
  CreateFacebookUserAccountRepository,
  LoadUserAccountRepository,
} from "../contracts/repos";
export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
      CreateFacebookUserAccountRepository
  ) {}
  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser({
      token: params.token,
    });
    if (fbData !== undefined) {
      await this.userAccountRepo.load({ email: fbData.email });
      await this.userAccountRepo.createFromFacebook(fbData);
    }
    return new AuthenticationError();
  }
}

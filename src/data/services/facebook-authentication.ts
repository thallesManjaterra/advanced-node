import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "../contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import {
  CreateFacebookUserAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookUserAccountRepository,
} from "../contracts/repos";
export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
      CreateFacebookUserAccountRepository &
      UpdateFacebookUserAccountRepository
  ) {}
  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser({
      token: params.token,
    });
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({
        email: fbData.email,
      });
      if (accountData !== undefined) {
        this.userAccountRepo.updateWithFacebook({
          id: accountData.id,
          name: accountData.name ?? fbData.name,
          facebookId: fbData.facebookId,
        });
      }
      await this.userAccountRepo.createFromFacebook(fbData);
    }
    return new AuthenticationError();
  }
}

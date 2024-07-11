import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "../contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import {
  CreateFacebookUserAccountRepository,
  LoadUserAccountRepository,
} from "../contracts/repos";
import { log } from "console";
export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository,
    private readonly createFacebookUserAccountRepo: CreateFacebookUserAccountRepository
  ) {}
  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser({
      token: params.token,
    });
    if (fbData !== undefined) {
      await this.loadUserAccountRepo.load({ email: fbData.email });
      await this.createFacebookUserAccountRepo.createFromFacebook(fbData);
    }
    return new AuthenticationError();
  }
}

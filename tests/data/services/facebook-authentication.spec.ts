import { FacebookAuthentication } from "@/domain/features";

class FacebookAuthenticationService {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) {}
  async perform(params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserApi.loadUser({ token: params.token });
  }
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };
}

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<void>;
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token;
  }
}

describe("FacebookAuthenticationService", () => {
  it("should call LoadFacebookUserApi with correct params", async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy);
    await sut.perform({ token: "any_token" });
    expect(loadFacebookUserApiSpy.token).toBe("any_token");
  });
});

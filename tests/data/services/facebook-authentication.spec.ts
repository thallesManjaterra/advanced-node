import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors";
import { mock } from "jest-mock-extended";
class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  callsCount = 0;
  result = undefined;
  async loadUser(
    params: LoadFacebookUserApi.Params
  ): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
    this.callsCount += 1;
    return this.result;
  }
}

describe("FacebookAuthenticationService", () => {
  it("should call LoadFacebookUserApi with correct params", async () => {
    const loadFacebookUserApiSpy = mock<LoadFacebookUserApi>();
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy);
    await sut.perform({ token: "any_token" });
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({
      token: "any_token",
    });
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1);
  });
  it("should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    const loadFacebookUserApiSpy = mock<LoadFacebookUserApi>();
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined);
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy);
    const authResult = await sut.perform({ token: "any_token" });
    expect(authResult).toEqual(new AuthenticationError());
  });
});

import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { LoadUserAccountRepository } from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors";
import { mock, MockProxy } from "jest-mock-extended";

describe("FacebookAuthenticationService", () => {
  let sut: FacebookAuthenticationService;
  let loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>;
  const token = "any_token";
  beforeEach(() => {
    loadFacebookUserApiSpy = mock<LoadFacebookUserApi>();
    loadUserAccountRepo = mock<LoadUserAccountRepository>();
    sut = new FacebookAuthenticationService(
      loadFacebookUserApiSpy,
      loadUserAccountRepo
    );
    loadFacebookUserApiSpy.loadUser.mockResolvedValue({
      name: "any_fb_name",
      email: "any_fb_email",
      facebookId: "any_fb_id",
    });
  });
  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({ token });
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({
      token,
    });
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1);
  });
  it("should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({ token });
    expect(authResult).toEqual(new AuthenticationError());
  });
  it("should call LoadUserAccountRepo when LoadFacebookUserApi returns data", async () => {
    const authResult = await sut.perform({ token });
    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({
      email: "any_fb_email",
    });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  });
});

import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors";
import { mock, MockProxy } from "jest-mock-extended";

type SutTypes = {
  sut: FacebookAuthenticationService;
  loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>;
};

const makeSut = (): SutTypes => {
  const loadFacebookUserApiSpy = mock<LoadFacebookUserApi>();
  const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy);
  return {
    sut,
    loadFacebookUserApiSpy,
  };
};

describe("FacebookAuthenticationService", () => {
  let sut: FacebookAuthenticationService;
  let loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>;
  const token = "any_token";
  beforeEach(() => {
    loadFacebookUserApiSpy = mock<LoadFacebookUserApi>();
    sut = new FacebookAuthenticationService(loadFacebookUserApiSpy);
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
});

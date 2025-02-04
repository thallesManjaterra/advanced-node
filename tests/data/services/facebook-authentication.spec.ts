import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { TokenGenerator } from "@/data/contracts/crypto";
import {
  LoadUserAccountRepository,
  SaveFacebookUserAccountRepository,
} from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors";
import { AccessToken, FacebookAccount } from "@/domain/models";

import { mock, MockProxy } from "jest-mock-extended";

jest.mock("@/domain/models/facebook-account");

describe("FacebookAuthenticationService", () => {
  let sut: FacebookAuthenticationService;
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepo: MockProxy<
    LoadUserAccountRepository & SaveFacebookUserAccountRepository
  >;
  let crypto: MockProxy<TokenGenerator>;
  let token: string;

  beforeAll(() => {
    token = "any_token";
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: "any_fb_name",
      email: "any_fb_email",
      facebookId: "any_fb_id",
    });
    userAccountRepo = mock();
    userAccountRepo.load.mockResolvedValue(undefined);
    userAccountRepo.saveWithFacebook.mockResolvedValue({
      id: "any_account_id",
    });
    crypto = mock();
    crypto.generateToken.mockResolvedValue("any_generated_token");
  });

  beforeEach(() => {
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto
    );
  });

  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token,
    });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });
  it("should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });
  it("should call LoadUserAccountRepo when LoadFacebookUserApi returns data", async () => {
    await sut.perform({ token });

    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: "any_fb_email",
    });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });
  it("should call SaveFacebookUserAccountRepository with FacebookAccount", async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({
      any: "any",
    }));
    jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

    await sut.perform({ token });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      any: "any",
    });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });
  it("should call TokenGenerator with correct params", async () => {
    await sut.perform({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: "any_account_id",
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });
  it("should return an AccessToken on success", async () => {
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AccessToken("any_generated_token"));
  });
  it("should rethrow if LoadFacebookUserApi throws", async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error("fb_error"));

    const authResultPromise = sut.perform({ token });

    expect(authResultPromise).rejects.toThrow(new Error("fb_error"));
  });
  it("should rethrow if LoadUserAccountRepository throws", async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error("load_error"));

    const authResultPromise = sut.perform({ token });

    expect(authResultPromise).rejects.toThrow(new Error("load_error"));
  });
  it("should rethrow if SaveFacebookUserAccountRepository throws", async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(
      new Error("save_error")
    );

    const authResultPromise = sut.perform({ token });

    expect(authResultPromise).rejects.toThrow(new Error("save_error"));
  });
  it("should rethrow if TokenGenerator throws", async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error("token_error"));

    const authResultPromise = sut.perform({ token });

    expect(authResultPromise).rejects.toThrow(new Error("token_error"));
  });
});

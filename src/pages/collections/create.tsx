import { PLACEHOLDER_IMAGE_URL } from "@src/constants";
import { useMarketplace } from "@src/context/Marketplace";
import applyPrivatePageLayout from "@src/layouts/PrivatePageLayout";
import { AppPage } from "@src/types";
import FormField, { TextareaFormField } from "@src/ui/forms/FormField";
import classNames from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const STEP_COLLAB_DETAILS = "0";
const STEP_COLLECTION_DETAILS = "1";
const STEP_CONFIRM = "2";

const CollectionsCreatePage: AppPage = () => {
  const marketplace = useMarketplace();

  const router = useRouter();
  const methods = useForm({ mode: "all" });
  const [submissionError, setSubmissionError] = useState("");

  const { step = STEP_COLLAB_DETAILS } = router.query as Record<string, string>;
  const { register, watch, handleSubmit, formState } = methods;
  const { isSubmitting } = formState;

  const isCollab = watch("isCollab") === "true";

  return (
    <div className="w-full max-w-3xl m-auto">
      <Head>
        <title>Create Collection | Constellation NFTs</title>
        <meta name="description" content="Create a new event" />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="prose dark:prose-invert">
        <h1>Create a New Collection</h1>

        <FormProvider {...methods}>
          <form
            action=""
            className="flex flex-col items-center border border-accent rounded-lg p-8"
            onSubmit={(e) =>
              handleSubmit(async (data) => {
                setSubmissionError("");
                console.log("Creating event", data);

                const collection = await marketplace.mintCollection(
                  data.name,
                  data.symbol
                );

                console.log("NEW COLLECTION", collection);
              })(e).catch((err) => {
                console.error("ERROR", err);

                setSubmissionError(err);
              })
            }
          >
            <ul className="steps mb-8 mx-auto">
              <li className="step step-primary">
                <Link
                  href={{
                    query: {
                      step: STEP_COLLAB_DETAILS,
                    },
                  }}
                >
                  <a>Collab Details</a>
                </Link>
              </li>
              <li
                className={classNames("step", {
                  "step-primary": step !== STEP_COLLAB_DETAILS,
                })}
              >
                <Link
                  href={{
                    query: { step: STEP_COLLECTION_DETAILS },
                  }}
                >
                  <a>Collection Details</a>
                </Link>
              </li>
              <li
                className={classNames("step", {
                  "step-primary": step === STEP_CONFIRM,
                })}
              >
                <Link
                  href={{
                    query: { step: STEP_CONFIRM },
                  }}
                >
                  <a>Confirm &amp; Pay</a>
                </Link>
              </li>
            </ul>

            {collabDetailsSection()}
            {collectionDetailsSection()}
            {confirmAndPaySection()}

            {submissionError ? (
              <div className="mt-4 alert alert-error text-sm">
                <div>
                  <span>Something went wrong, please try again</span>
                </div>
              </div>
            ) : null}

            <div className="mt-8 w-full flex flex-row-reverse items-center">
              <button
                type="submit"
                className={classNames("btn btn-primary", {
                  hidden: step !== STEP_CONFIRM,
                  loading: isSubmitting,
                  "btn-disabled": isSubmitting,
                })}
              >
                Create collection
              </button>

              <Link
                href={{
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    step:
                      step === STEP_COLLAB_DETAILS
                        ? STEP_COLLECTION_DETAILS
                        : STEP_CONFIRM,
                  },
                }}
              >
                <a
                  className={classNames("btn btn-primary", {
                    hidden: step === STEP_CONFIRM,
                  })}
                >
                  Continue
                </a>
              </Link>

              <Link
                href={{
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    step:
                      step === STEP_CONFIRM
                        ? STEP_COLLECTION_DETAILS
                        : STEP_COLLAB_DETAILS,
                  },
                }}
              >
                <a
                  className={classNames("mr-4 btn btn-ghost", {
                    hidden: step === STEP_COLLAB_DETAILS,
                    "btn-disabled": isSubmitting,
                  })}
                >
                  Back
                </a>
              </Link>

              <Link href="/events">
                <a
                  className={classNames("mr-4 btn btn-ghost", {
                    hidden: step !== STEP_COLLAB_DETAILS,
                  })}
                >
                  Back to my collections
                </a>
              </Link>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );

  function collabDetailsSection() {
    return (
      <section
        className={classNames({
          hidden: step !== STEP_COLLAB_DETAILS,
        })}
      >
        <div className="mb-4 prose dark:prose-invert">
          <h3>Collab Details</h3>

          <p>Do you plan to use works from any other collection?</p>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <input
              type="radio"
              value="true"
              className="radio"
              {...register("isCollab")}
            />
            <span className="label-text">Yes</span>
          </label>

          <label className="label cursor-pointer">
            <input
              type="radio"
              value="false"
              className="radio"
              {...register("isCollab")}
            />
            <span className="label-text">No</span>
          </label>
        </div>

        {isCollab ? (
          <div>TODO: pick instant collab agreement from menu</div>
        ) : null}

        {/* {connections.map((connection) =>
          universeCard(universes.find((uni) => uni.id === connection)!, "none")
        )} */}

        {/* <label
          htmlFor="connect-universe-others"
          className={classNames("btn btn-sm btn-primary modal-button", {
            hidden: connections.length,
          })}
        >
          Add
        </label> */}

        <input
          type="checkbox"
          id="connect-universe-others"
          className="modal-toggle"
        />
        <label
          htmlFor="connect-universe-others"
          className="modal cursor-pointer"
        >
          <label className="modal-box w-11/12 max-w-3xl">
            <p className="mb-4 mt-0 text-lg font-bold">
              Connect another Universe
            </p>

            <div className="flex flex-col gap-4">
              {/* {universes.map((uni) => universeCard(uni, "connect"))} */}
            </div>

            <div className="modal-action">
              <label
                htmlFor="connect-universe-others"
                className="btn btn-ghost"
              >
                Cancel
              </label>
            </div>
          </label>
        </label>
      </section>
    );
  }

  function collectionDetailsSection() {
    return (
      <section
        className={classNames("w-full", {
          hidden: step !== STEP_COLLECTION_DETAILS,
        })}
      >
        <label htmlFor="event-detail-image-modal" className="modal-button">
          <img
            src={PLACEHOLDER_IMAGE_URL}
            alt=""
            className="h-80 cursor-pointer m-auto"
          />
        </label>

        <input
          type="checkbox"
          id="event-detail-image-modal"
          className="modal-toggle"
        />
        <label
          htmlFor="event-detail-image-modal"
          className="modal cursor-pointer"
        >
          <label className="modal-box relative">
            <span className="text-lg font-bold">Change Event Image</span>

            <FormField
              name="imageUrl"
              label="Image URL"
              placeholder="e.g. https://picsum.photos/300"
            />

            <div className="modal-action">
              <label
                htmlFor="event-detail-image-modal"
                className="btn btn-primary"
              >
                Set image
              </label>
            </div>
          </label>
        </label>

        <FormField name="name" label="Name" autoComplete="off" />
        <FormField
          name="symbol"
          label="Symbol"
          maxLength={4}
          autoComplete="off"
        />

        <TextareaFormField
          name="description"
          label="Description"
          showOptionalLabel
        />
      </section>
    );
  }

  function confirmAndPaySection() {
    return (
      <section
        className={classNames("w-full px-8 text-right", {
          hidden: step !== STEP_CONFIRM,
        })}
      >
        <section className="mb-8 p-4 border border-accent rounded-md text-right">
          <p className="text-left">
            The following fees will apply for any transactions
          </p>
          {/* {connections.map((id) => (
            <p key={String(id)} className="text-sm">
              <a
                className="link link-accent"
                href={`/universes/${id}`}
                target="_blank"
                rel="noreferrer nofollow"
              >
                {universes.find((uni) => uni.id === id)!.name}
              </a>{" "}
              royalty: {DEFAULT_USAGE_TERMS.royaltyFee}%
            </p>
          ))} */}
          <p className="text-sm">Platform fee: 5%</p>

          <div className="divider"></div>
          <p>
            Total: 5%
            {/* Total: {5 + connections.length * DEFAULT_USAGE_TERMS.royaltyFee}% */}
          </p>
        </section>

        {/* {connections.length ? (
          <p className="text-sm text-left">Universe connection fees</p>
        ) : null} */}

        {/* {connections.map((id) => (
          <p key={String(id)} className="text-sm">
            <a
              className="link link-accent"
              href={`/universes/${id}`}
              target="_blank"
              rel="noreferrer nofollow"
            >
              {universes.find((uni) => uni.id === id)!.name}
            </a>{" "}
            connection fee: {formatFractionalICP(DEFAULT_USAGE_TERMS.fixedFee)}
          </p>
        ))} */}

        <p className="text-sm text-left">Platform fees</p>
        <p className="text-sm">Registration: {10}</p>

        <div className="divider"></div>

        <p>
          Total: 100
          {/* {
            BigInt(5e6) +
              BigInt(connections.length) * DEFAULT_USAGE_TERMS.fixedFee
          } */}
        </p>

        <div className="alert alert-warning p-4 text-sm text-left">
          <div>
            <span>Earn more by enabling instant collaborations</span>
          </div>
        </div>
      </section>
    );
  }
};

CollectionsCreatePage.applyLayout = applyPrivatePageLayout;

export default CollectionsCreatePage;

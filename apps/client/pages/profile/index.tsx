import {
  faArrowLeft,
  faEllipsisVertical,
  faRightFromBracket,
  faTrashCan,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Button,
  Title,
  Text,
  ActionIcon,
  Menu,
  Box,
  Stack,
  Skeleton,
} from "@mantine/core";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { Route } from "../../lib/constant";
import { jwt } from "../../lib/helpers/jwt.helper";
import { useAttemptService } from "../../services/attempt/useAttemptService";
import { authService } from "../../services/auth/auth.service";
import { User } from "../../services/user/entity/user.entity";
import { useUserService } from "../../services/user/useUserService";

type Data = {
  user: User;
};

export const getServerSideProps: GetServerSideProps<Data> = async ({ req }) => {
  const user = jwt.decode(req.cookies.access_token as string) as User;
  console.log(`user`, user);
  return {
    props: { user },
  };
};

export default function ProfilePage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    findByUserId: {
      isLoading: isAttemptHistoryLoading,
      isError: isAttemptHistoryError,
      isSuccess: isAttemptHistorySuccess,
      response: attemptHistoryResponse,
    },
  } = useAttemptService({ userId: user.id });

  const {
    findById: {
      isLoading: isFindUserByIdLoading,
      isSuccess: isFindUserByIdSuccess,
      isError: isFindUserByIdError,
      response: findUserByIdResponse,
    },
  } = useUserService({ userId: user.id });

  return (
    <>
      <Head>
        <title>Profil | Presisi</title>
      </Head>
      <main className="profile-page py-[16px]">
        <header className="px-[16px]">
          <div className="my-container flex items-center">
            <ActionIcon component={Link} href={Route.HOME}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </ActionIcon>
            <div className="spacer grow"></div>
            <Menu shadow="xl" position="bottom-end" width="192px">
              <Menu.Target>
                <ActionIcon title="profile-menu" radius="md">
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown style={{ padding: "8px" }}>
                <Menu.Item
                  color="red"
                  icon={<FontAwesomeIcon icon={faRightFromBracket} />}
                  onClick={authService.signOut}
                >
                  Keluar
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </header>

        <section className="px-[16px] mt-[16px]">
          <div className="my-container flex flex-col items-center sm:flex-row gap-[24px]">
            <Skeleton
              className="rounded-full"
              circle
              visible={!findUserByIdResponse?.data}
            >
              <Avatar
                alt="user profile pic"
                size="xl"
                color="orange"
                style={{ borderRadius: 9999 }}
              >
                {findUserByIdResponse?.data.name.charAt(0)}
              </Avatar>
            </Skeleton>

            <div className="flex flex-col items-center sm:items-start">
              {!findUserByIdResponse?.data ? (
                <Skeleton height={31} width={230} />
              ) : (
                <Title order={2} className="text-center sm:text-left">
                  {findUserByIdResponse?.data.name}
                </Title>
              )}

              {!findUserByIdResponse?.data ? (
                <Skeleton height={21} width={200} className="mt-[8px]" />
              ) : (
                <Text className="text-center sm:text-left" color="gray">
                  {findUserByIdResponse?.data.email}
                </Text>
              )}
            </div>
            <div className="hidden sm:block grow"></div>
            <Button
              component={Link}
              href={Route.EDIT_PROFILE}
              leftIcon={<FontAwesomeIcon icon={faUserPen} />}
              variant="subtle"
              className="mt-[-8px] sm:mt-0"
            >
              Edit profil
            </Button>
          </div>
        </section>

        <section className="history px-[16px] mt-[32px]">
          <div className="my-container">
            <Title order={3}>History</Title>{" "}
            <Stack className="mt-[16px]">
              {!attemptHistoryResponse?.data ? (
                <>
                  <Skeleton height={52} />
                  <Skeleton height={52} />
                  <Skeleton height={52} />
                  <Skeleton height={52} />
                  <Skeleton height={52} />
                </>
              ) : (
                attemptHistoryResponse?.data.map(attempt => (
                  <Box
                    key={attempt.id}
                    className="rounded-[8px] p-[8px] flex items-center border shadow border-gray-200 border-solid"
                  >
                    <Text>
                      {new Date(
                        attempt.created_at as unknown as string
                      ).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "long",
                      })}
                    </Text>
                    <div className="spacer grow"></div>
                    {/* <Button
                      leftIcon={<FontAwesomeIcon icon="eye" />}
                      variant="light"
                      color="gray"
                    >
                      Detail
                    </Button> */}
                    <ActionIcon color="red" variant="subtle">
                      <FontAwesomeIcon icon={faTrashCan} />
                    </ActionIcon>
                  </Box>
                ))
              )}
            </Stack>
          </div>
        </section>
      </main>
    </>
  );
}

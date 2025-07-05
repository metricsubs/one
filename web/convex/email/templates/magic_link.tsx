import { Body, Container, Head, Html, Link, Text } from "@react-email/components";

export interface MagicLinkEmailProps {
    email: string;
    url: string;
}

export function MagicLinkEmail({ email, url }: MagicLinkEmailProps) {
    return (
        <Html>
            <Head />
            <Body>
                <Container>
                    <Text>Hello {email}</Text>
                    <Link href={url}>Click here to sign in</Link>
                </Container>
            </Body>
        </Html>
    )
}

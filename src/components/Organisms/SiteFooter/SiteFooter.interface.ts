export interface SiteFooterProps {
    beyondTheCode: {
        title: string;
        subtitle: string;
        sections: {
            title: string;
            duration: string;
            points: string[];
        }[];
    };
    contact: {
        title: string;
        links: {
            text: string;
            href: string;
            hoverClass: string;
        }[];
    };
    copyright: string;
}

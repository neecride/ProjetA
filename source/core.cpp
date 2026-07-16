#define CROW_ENABLE_COMPRESSION
#include <crow.h>

const bool debug = true;


class ProjetA
    {
    public:
        void run()
            {
                includeHTML_initialization();
                crowRoute_initialization();
                start();
            }
    private:
    crow::mustache::context includeHTML;
    crow::SimpleApp ProjetA_App;


        //cette fonction permet de remplacer dans une page html {{EXEMPLE}} par le contenue définie 
        void includeHTML_initialization()
            {
                //mettre le contenue de includeHTML/header.html en mémoire dans includeHTML
                //a chaque fois que dans une page html il-y-aura {{header}} alors il sera remplacer par le contenue du fichier en RAM
                includeHTML["header"] = crow::mustache::load_text("include/header.html");

                //idem que header, {{footer}} dans une page html remplacera le contenue par includeHTML/footer.html
                includeHTML["footer"] = crow::mustache::load_text("include/footer.html");
            }


            // Charge en mémoire RAM les pages HTML importantes (= améliore la vitesse)
            // Puisque les pages HTML en question sont stockées en mémoire RAM au démarrage,
            // les modifications à chaud seront appliquées UNIQUEMENT au démarrage/redémarrage du site.
            // À activer ou désactiver selon le/s besoin/s
            //crow::mustache::template_t index = crow::mustache::load("index.html");
            //crow::mustache::template_t Err404 = crow::mustache::load("Err/Err404.html");


            // return la page Err404
            crow::response Err404() 
                {
                    crow::mustache::template_t Err404 = crow::mustache::load("/Err/Err404.html");
                    return crow::response(404, Err404.render(includeHTML));     
                }

                
            void crowRoute_initialization()
                {

                //  <<https://nom_de_domain_exemple/>> redirige vers index.html
                CROW_ROUTE(ProjetA_App, "/")([this]()
                    {
                        crow::mustache::template_t index = crow::mustache::load("index.html");
                        return crow::response(index.render(includeHTML));
                    }
                );

                //Ajoutez d'autres crow-routes dans cette fonction
 
                //https://nomdedomain.fr/string/string/string
                CROW_ROUTE(ProjetA_App, "/<string>/<string>/<string>")([this](std::string string1, std::string string2, std::string string3)
                    {      
                        if (string1 == "res") //Si string1 == res alors renvoie la res demandé
                            {                  
                                if (std::filesystem::exists("static/" + string2 + "/" + string3))
                                    {
                                        crow::response res;
                                        res.set_static_file_info("static/" + string2 + "/" + string3);
                                        if (!debug) //...si bool debug est négatif
                                        {
                                            res.add_header("Cache-Control", "public, max-age=3600"); // <--- 1 Heure en cache pour améliorer la vitesse de navigation
                                        }
                                        return res;
                                    }
                                else {return Err404();}
                            }
                        return Err404();
                    }
                );

                // Par défaut renvoie la page 404
                CROW_CATCHALL_ROUTE(ProjetA_App)([this]()
                    {
                        return Err404();
                    }
                );

            }

            //start pour une configuration avec un proxy inverse ou en local sur http://127.0.0.1:18080
            void start()
                {
                    ProjetA_App.bindaddr("127.0.0.1")
                    .port(18080) //...sur le port 18080
                    .multithreaded()
                    .run();
                }
    };

//======

int main()
    {
        system("clear");
        ProjetA app;

        try
        {
            app.run();
        } 

        catch (const std::exception& e)
        {
            std::cerr << e.what() << std::endl;
            return EXIT_FAILURE;
        }

    }
'use client';

import {CheckCircle2, Layers, Leaf, PiggyBank, ShieldCheck, Vote, Zap} from 'lucide-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import FeatureRow from "./_components/FeatureRow";
import StepCard from "./_components/StepCard";
import MetricCard from "./_components/MetricCard";

export default function Home() {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  return (
      <main className="mx-auto max-w-6xl space-y-16 px-4 py-10 lg:space-y-24 lg:px-0">
          {/* HERO */}
          <section className="grid gap-10 rounded-3xl border border-slate-200 bg-white px-6 py-10 dark:border-border dark:bg-card lg:grid-cols-[1.4fr,1fr] lg:px-10 lg:py-12">
              <div className="space-y-6">
                  <Badge className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                      Autoconsommation collective
                  </Badge>

                  <h1 className="text-3xl font-semibold leading-tight text-slate-900 dark:text-foreground sm:text-4xl lg:text-[2.8rem]">
                      L&apos;autoconsommation collective{" "}
                      <span className="text-emerald-600 dark:text-emerald-400">tokenisée</span> pour tous.
                  </h1>

                  <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-muted-foreground">
                      Energy Flow révolutionne le partage d&apos;énergie solaire locale
                      grâce à la blockchain. Producteurs et consommateurs se
                      connectent directement dans un réseau décentralisé, transparent
                      et équitable.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                      <Button asChild className="h-9 rounded-full bg-emerald-500 px-5 text-xs font-semibold text-white hover:bg-emerald-600">
                          <a href="#what-is-energy-flow">Découvrir le protocole</a>
                      </Button>
                      {!isConnected && (
                          <Button
                              variant="outline"
                              className="h-9 rounded-full border-slate-300 bg-white px-5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-border dark:bg-secondary dark:text-foreground dark:hover:bg-accent"
                              onClick={openConnectModal}
                          >
                              Se connecter
                          </Button>
                      )}
                  </div>
              </div>

              {/* Hero stats card */}
              <Card className="border-slate-200 bg-slate-50 dark:border-border dark:bg-background">
                  <CardContent className="flex h-full flex-col justify-center gap-6 py-6">
                      <div className="flex flex-col gap-1">
                          <span className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
                              124k€
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-muted-foreground">
                              TVL total
                          </span>
                      </div>
                      <div className="h-px bg-slate-200 dark:bg-border" />
                      <div className="flex flex-col gap-1">
                          <span className="text-2xl font-semibold text-slate-900 dark:text-foreground">
                              45k
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-muted-foreground">
                              kWh produits
                          </span>
                      </div>
                      <div className="h-px bg-slate-200 dark:bg-border" />
                      <div className="flex flex-col gap-1">
                          <span className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                              8.5%
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-muted-foreground">
                              APY moyen
                          </span>
                      </div>
                  </CardContent>
              </Card>
          </section>

          {/* WHAT IS ENERGY FLOW */}
          <section id="what-is-energy-flow" className="space-y-6 scroll-mt-20">
              <div className="flex justify-center">
                  <Badge className="rounded-full bg-slate-200 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-secondary dark:text-muted-foreground">
                      Powered by Base Network
                  </Badge>
              </div>

              <Card className="space-y-8 border-slate-200 bg-white px-6 py-8 dark:border-border dark:bg-card lg:px-10">
                  <div className="space-y-2 text-center">
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground lg:text-2xl">
                          Qu&apos;est-ce qu&apos;Energy Flow&nbsp;?
                      </h2>
                      <p className="mx-auto max-w-3xl text-sm text-slate-600 dark:text-muted-foreground">
                          Energy Flow est la première plateforme décentralisée
                          d&apos;autoconsommation collective combinant gouvernance DAO et
                          protocoles DeFi. Nous permettons aux producteurs solaires de
                          maximiser leurs revenus et aux consommateurs de réduire leurs
                          factures, tout en restant sur la blockchain Base avec une
                          conformité totale à la réglementation française.
                      </p>
                  </div>

                  <div className="space-y-2">
                      {/* Feature rows */}
                      <FeatureRow
                          icon={<Zap className="h-4 w-4" />}
                          title="Production locale"
                          description="Partagez votre électricité solaire avec vos voisins dans un rayon de 2 km. 100% d'énergie renouvelable et locale."
                      />
                      <FeatureRow
                          icon={<ShieldCheck className="h-4 w-4" />}
                          title="Blockchain sécurisée"
                          description="Transactions transparentes et immuables sur Base Network avec stablecoin EURC pour éviter la volatilité."
                      />
                      <FeatureRow
                          icon={<Vote className="h-4 w-4" />}
                          title="Gouvernance DAO"
                          description="Votez sur les décisions importantes : tarifs, règles de répartition, investissements. Une voix = un vote."
                      />
                      <FeatureRow
                          icon={<PiggyBank className="h-4 w-4" />}
                          title="Revenus optimisés"
                          description="Producteurs : +25% de revenus vs revente EDF. Consommateurs : -15% sur les factures d'électricité."
                      />
                      <FeatureRow
                          icon={<Layers className="h-4 w-4" />}
                          title="Protocoles DeFi"
                          description="Yield farming sur Aave V3 avec EURC. Buffer de sécurité pour protéger les communautés."
                      />
                      <FeatureRow
                          icon={<CheckCircle2 className="h-4 w-4" />}
                          title="100% conforme"
                          description="Respect total de la réglementation : ACC Enedis, RGPD, MiCA. Structure juridique française (loi 1901)."
                      />
                  </div>
              </Card>
          </section>

          {/* HOW IT WORKS */}
          <section className="space-y-6">
              <div className="flex justify-center">
                  <Badge className="rounded-full bg-emerald-500/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                      Comment ça marche ?
                  </Badge>
              </div>

              <Card className="space-y-8 border-slate-200 bg-white px-6 py-8 dark:border-border dark:bg-card lg:px-10">
                  <div className="space-y-2 text-center">
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground lg:text-2xl">
                          4 étapes simples pour participer
                      </h2>
                      <p className="mx-auto max-w-3xl text-sm text-slate-600 dark:text-muted-foreground">
                          Rejoignez Energy Flow en quelques minutes et commencez à
                          bénéficier d&apos;une énergie locale, propre et économique.
                      </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-4">
                      <StepCard
                          step="1"
                          title="Inscription"
                          description="Créez votre compte et connectez votre wallet. Adhérez à la PMO (association loi 1901)."
                      />
                      <StepCard
                          step="2"
                          title="Choix du rôle"
                          description="Producteur : enregistrez votre installation solaire. Consommateur : liez votre contrat Enedis."
                      />
                      <StepCard
                          step="3"
                          title="Mint EFT"
                          description="Recevez vos tokens EFT : 1 EFT = 1 kWh. Producteurs : production valorisée. Consommateurs : dépôt garanti."
                      />
                      <StepCard
                          step="4"
                          title="Partage d'énergie"
                          description="L'énergie est automatiquement répartie selon les clés définies. Factures mensuelles en EUR."
                      />
                  </div>
              </Card>
          </section>

          {/* STATS SECTION */}
          <section className="space-y-6">
              <h2 className="text-center text-lg font-semibold text-slate-900 dark:text-foreground lg:text-xl">
                  Energy Flow en chiffres
              </h2>

              <div className="space-y-3">
                  <MetricCard
                      label="EFT tokens émis"
                      value="124,567"
                      icon={<Zap className="h-4 w-4" />}
                  />
                  <MetricCard
                      label="Économies consommateurs"
                      value="18,234€"
                      icon={<PiggyBank className="h-4 w-4" />}
                  />
                  <MetricCard
                      label="Revenus producteurs"
                      value="23,458€"
                      icon={<Leaf className="h-4 w-4" />}
                  />
                  <MetricCard
                      label="Buffer sécurité"
                      value="38,542€"
                      icon={<ShieldCheck className="h-4 w-4" />}
                  />
              </div>
          </section>

          {/* CTA FINAL */}
          <section className="mb-10">
              <Card className="border-slate-200 bg-slate-100 px-6 py-10 text-center dark:border-border dark:bg-card lg:px-10">
                  <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground lg:text-2xl">
                          Prêt à rejoindre la révolution énergétique&nbsp;?
                      </h2>
                      <p className="mx-auto max-w-2xl text-sm text-slate-600 dark:text-muted-foreground">
                          Que vous soyez producteur d&apos;énergie solaire ou simple
                          consommateur, Energy Flow vous permet de participer activement
                          à la transition énergétique tout en optimisant vos finances.
                      </p>
                      <Button className="mt-2 h-10 rounded-full bg-emerald-500 px-6 text-xs font-semibold text-white hover:bg-emerald-600">
                          Commencer maintenant
                      </Button>
                  </div>
              </Card>
          </section>
      </main>
  );
}
